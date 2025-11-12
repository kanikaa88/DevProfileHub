class Solution {
    public String removeOuterParentheses(String s) {
        StringBuilder str = new StringBuilder();
        int count = 0;
        for(int i = 0;i< s.length();i++){
            if(s.charAt(i) == '('){
                count++;
                if(count>1){
                    str.append('(');
                }
            }
            else{
                
                if(count > 1){
                    str.append(')');
                }
                count--;
            }
        }
        return  str.toString();
    }
}