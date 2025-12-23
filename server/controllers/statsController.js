const axios = require("axios");
const cheerio = require("cheerio");
const cache = require("../utils/cache");


// 🔹 GitHub Stats
const getGitHubStats = async (req, res) => {
  const { username } = req.query;

  if (!username || username.trim() === "") {
    return res.status(400).json({ message: "GitHub username is required" });
  }

  // Check cache first
  const cacheKey = cache.getGitHubStatsKey(username);
  const cachedData = await cache.get(cacheKey);
  if (cachedData) {
    console.log(`✅ Serving GitHub stats from cache for ${username}`);
    return res.status(200).json(cachedData);
  }

  try {
    const response = await axios.get(`https://api.github.com/users/${username}`, {
      headers: { 
        "User-Agent": "devprofilehub",
        "Accept": "application/vnd.github.v3+json"
      },
      timeout: 10000
    });

    const userData = response.data;

    // Get contribution data for the current year
    const currentYear = new Date().getFullYear();
    const startDate = `${currentYear}-01-01`;
    const endDate = `${currentYear}-12-31`;
    
    let contributionData = null;
    let totalContributions = 0;
    
    try {
      // Try to get contribution data from GitHub API
      const contribResponse = await axios.get(`https://api.github.com/users/${username}/events/public?per_page=100`, {
        headers: { 
          "User-Agent": "devprofilehub",
          "Accept": "application/vnd.github.v3+json"
        },
        timeout: 10000
      });
      const events = contribResponse.data;
      
      console.log(`GitHub events fetched for ${username}:`, events.length, 'events');
      
      // Count contributions by date
      const contributions = {};
      events.forEach(event => {
        const date = event.created_at.split('T')[0];
        if (date >= startDate && date <= endDate) {
          contributions[date] = (contributions[date] || 0) + 1;
        }
      });
      
      contributionData = contributions;
      totalContributions = Object.values(contributions).reduce((sum, count) => sum + count, 0);
      
      console.log(`GitHub contributions for ${username}: ${totalContributions} total, ${Object.keys(contributions).length} days`);
      
      // If no contributions found, return null instead of sample data
      if (totalContributions === 0) {
        console.log(`No contributions found for ${username}. This could mean:`);
        console.log(`1. User has no recent public activity`);
        console.log(`2. User's events are private`);
        console.log(`3. Username might be incorrect`);
        console.log(`4. User might not exist`);
        
        // Don't create sample data - return null to indicate no real data
        contributionData = null;
        totalContributions = 0;
      }
    } catch (contribErr) {
      console.log("Could not fetch detailed contribution data:", contribErr.message);
    }

    const responseData = {
      username,
      name: userData.name,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      profileUrl: userData.html_url,
      avatarUrl: userData.avatar_url,
      bio: userData.bio,
      location: userData.location,
      contributionData: contributionData,
      totalContributions: totalContributions
    };

    // Cache the response for 5 minutes
    await cache.set(cacheKey, responseData, 300);
    console.log(`✅ Cached GitHub stats for ${username}`);

    res.status(200).json(responseData);
  } catch (err) {
    console.error("❌ GitHub error:", err.message);
    if (err.response?.status === 404) {
      res.status(404).json({ message: "GitHub user not found" });
    } else if (err.response?.status === 403) {
      res.status(503).json({ message: "GitHub API rate limit exceeded. Please try again later." });
    } else if (err.code === 'ECONNABORTED') {
      res.status(504).json({ message: "Request timeout. Please try again." });
    } else {
      res.status(500).json({ message: `Error fetching GitHub stats: ${err.message}` });
    }
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

    // Get stats from the community stats API first (may be unstable)
    let totalSolved = null, easySolved = null, mediumSolved = null, hardSolved = null, ranking = null;
    try {
      const response = await axios.get(`https://leetcode-stats-api.herokuapp.com/${username}`, { timeout: 7000 });
      const data = response.data;
      if (data.status === "success") {
        totalSolved = data.totalSolved;
        easySolved = data.easySolved;
        mediumSolved = data.mediumSolved;
        hardSolved = data.hardSolved;
        ranking = data.ranking;
      }
    } catch (apiErr) {
      console.log("LeetCode stats API failed, falling back to GraphQL only");
    }

    // If stats missing, fallback to GraphQL progress query
    if (totalSolved == null) {
      try {
        const progressResponse = await axios.post('https://leetcode.com/graphql', {
          query: `
            query userQuestionsSolved($username: String!) {
              allQuestionsCount { difficulty count }
              matchedUser(username: $username) {
                submitStatsGlobal {
                  acSubmissionNum { difficulty count }
                  acTotal
                }
              }
            }
          `,
          variables: { username }
        }, {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
          },
          timeout: 8000,
        });

        const submit = progressResponse.data?.data?.matchedUser?.submitStatsGlobal;
        const acList = submit?.acSubmissionNum || [];
        totalSolved = submit?.acTotal ?? 0;
        const pick = (diff) => acList.find(i => i.difficulty.toLowerCase() === diff)?.count ?? 0;
        easySolved = pick('easy');
        mediumSolved = pick('medium');
        hardSolved = pick('hard');
      } catch (fallbackErr) {
        // ignore
      }
    }

    if (totalSolved == null) {
      return res.status(502).json({ message: "LeetCode service unavailable. Try again later." });
    }

    // Get submission calendar data
    let submissionData = null;
    let totalSubmissions = 0;
    
    try {
      const calendarResponse = await axios.post('https://leetcode.com/graphql', {
        query: `
          query userProfileCalendar($username: String!, $year: Int!) {
            matchedUser(username: $username) {
              userCalendar(year: $year) {
                totalActiveDays
                submissionCalendar
              }
            }
          }
        `,
        variables: { username, year: new Date().getFullYear() }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        },
        timeout: 8000,
      });

      const calendar = calendarResponse.data?.data?.matchedUser?.userCalendar;
      if (calendar?.submissionCalendar) {
        // Parse the submission calendar JSON string
        const submissions = JSON.parse(calendar.submissionCalendar);
        submissionData = submissions;
        totalSubmissions = Object.values(submissions).reduce((sum, count) => sum + count, 0);
      }
    } catch (calendarErr) {
      console.log("Could not fetch LeetCode submission calendar");
    }

    res.status(200).json({
      username: profileInfo?.username || username,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      ranking,
      avatar: profileInfo?.profile?.userAvatar || null,
      realName: profileInfo?.profile?.realName || null,
      aboutMe: profileInfo?.profile?.aboutMe || null,
      location: profileInfo?.profile?.location || null,
      submissionData: submissionData,
      totalSubmissions: totalSubmissions
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
