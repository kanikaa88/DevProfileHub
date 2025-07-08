const axios = require("axios");
const cheerio = require("cheerio");


// 🔹 GitHub Stats
const getGitHubStats = async (req, res) => {
  const { username } = req.query;

  if (!username || username.trim() === "") {
    return res.status(400).json({ message: "GitHub username is required" });
  }

  try {
    const response = await axios.get(`https://api.github.com/users/${username}`, {
  headers: { "User-Agent": "devprofilehub" }
});

    const userData = response.data;

    res.status(200).json({
      username,
      name: userData.name,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      profileUrl: userData.html_url,
      avatarUrl: userData.avatar_url,
      bio: userData.bio,
      location: userData.location,
    });
  } catch (err) {
    console.error("❌ GitHub error:", err.message);
    res.status(404).json({ message: "GitHub user not found" });
  }
};

// 🔹 LeetCode Stats
const getLeetCodeStats = async (req, res) => {
  const { username } = req.query;

  if (!username || username.trim() === "") {
    return res.status(400).json({ message: "LeetCode username is required" });
  }

  try {
    // Try to get profile info from LeetCode GraphQL API
    let profileInfo = null;
    try {
      const graphqlResponse = await axios.post('https://leetcode.com/graphql', {
        query: `
          query userPublicProfile($username: String!) {
            matchedUser(username: $username) {
              username
              profile {
                userAvatar
                realName
                aboutMe
                location
              }
            }
          }
        `,
        variables: { username }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      });
      
      if (graphqlResponse.data?.data?.matchedUser) {
        profileInfo = graphqlResponse.data.data.matchedUser;
      }
    } catch (graphqlErr) {
      console.log("GraphQL API failed, using stats API only");
    }

    // Get stats from the stats API
    const response = await axios.get(`https://leetcode-stats-api.herokuapp.com/${username}`);
    const data = response.data;

    if (data.status !== "success") {
      return res.status(404).json({ message: "LeetCode user not found" });
    }

    res.status(200).json({
      username: profileInfo?.username || username,
      totalSolved: data.totalSolved,
      easySolved: data.easySolved,
      mediumSolved: data.mediumSolved,
      hardSolved: data.hardSolved,
      ranking: data.ranking,
      avatar: profileInfo?.profile?.userAvatar || null,
      realName: profileInfo?.profile?.realName || null,
      aboutMe: profileInfo?.profile?.aboutMe || null,
      location: profileInfo?.profile?.location || null,
    });
  } catch (err) {
    console.error("❌ LeetCode error:", err.message);
    res.status(500).json({ message: "Error fetching LeetCode stats" });
  }
};

// 🔹 Codeforces Stats
const getCodeforcesStats = async (req, res) => {
  const { username } = req.query;
if (!username || username.trim() === "") {
  return res.status(400).json({ message: "Codeforces username required" });
}


  try {
    const response = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
    const user = response.data.result[0];

    res.status(200).json({
      handle: user.handle,
      rating: user.rating || "Unrated",
      maxRating: user.maxRating || "N/A",
      rank: user.rank || "N/A",
      maxRank: user.maxRank || "N/A",
      contribution: user.contribution,
      avatar: user.titlePhoto,
    });
  } catch (err) {
    console.error("❌ Codeforces error:", err.message);
    res.status(404).json({ message: "Codeforces user not found" });
  }
};

// 🔹 HackerRank Stats
const getHackerRankStats = async (req, res) => {
  const { username } = req.query;
  if (!username || username.trim() === "") {
    return res.status(400).json({ message: "HackerRank username required" });
  }

  try {
    const profileUrl = `https://www.hackerrank.com/${username}`;
    const { data: html } = await axios.get(profileUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"macOS"',
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(html);

    // ✅ Profile picture - try multiple selectors
    let avatar = null;
    const avatarSelectors = [
      'img[src*="profile"]',
      'img[alt*="profile"]',
      'img[alt*="avatar"]',
      'img[class*="avatar"]',
      'img[class*="profile"]',
      '.profile-avatar img',
      '.avatar img',
      'img[src*="hackerrank"]'
    ];

    for (const selector of avatarSelectors) {
      const img = $(selector).first();
      if (img.length > 0) {
        avatar = img.attr('src');
        if (avatar && avatar.startsWith("/")) {
          avatar = `https://www.hackerrank.com${avatar}`;
        }
        break;
      }
    }

    // ✅ Location
    let location = $("span.location").text().trim() || 
                   $(".profile-location").text().trim() ||
                   $("[class*='location']").text().trim();

    // ✅ Try to get stats from various selectors
    let totalSolved = 0;
    let rank = "N/A";

    // Try different selectors for stats
    $("div.stat, .stat, [class*='stat'], [class*='score'], [class*='solved']").each((i, el) => {
      const text = $(el).text().toLowerCase();
      if (text.includes("solved") || text.includes("problems") || text.includes("challenges")) {
        const match = text.match(/(\d+)/);
        if (match) totalSolved = parseInt(match[1]);
      }
    });

    // Try to get rank/score
    $("div.rank, .rank, [class*='rank'], [class*='rating']").each((i, el) => {
      const text = $(el).text().trim();
      if (text && text !== "N/A" && text.length < 20) {
        rank = text;
      }
    });

    res.status(200).json({
      username,
      profileUrl,
      avatar: avatar || null,
      location: location || null,
      totalSolved: totalSolved || 0,
      rank: rank,
    });
  } catch (err) {
    console.error("❌ HackerRank scraping error:", err.message);
    res.status(500).json({ message: "Error fetching HackerRank info" });
  }
};





module.exports = {
  getGitHubStats,
  getLeetCodeStats,
  getCodeforcesStats,
  getHackerRankStats,
};
