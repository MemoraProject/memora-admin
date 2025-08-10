curl -X 'POST' \
  'domain.com/api/AI/auto-fill' \
  -d '{
  "words": [
    {
      "word": "特定",
      "meaning": "",
      "pronounce": "",
      "sinoVietnamese": "",
      "type": "",
      "meaningDescription": "",
      "example": "",
      "exampleMeaning": ""
    }
  ]
}'

	
Response body
{
  "data": [
    {
      "word": "特定",
      "meaning": "Đặc định, xác định",
      "pronunciation": "とくてい",
      "sinoVietnamese": "Đặc Định",
      "type": "danh từ, tính từ đuôi な, động từ する",
      "meaningDescription": "特別に定めること。他と区別して、これであると決めること。また、その定められた、または決められた内容や状態。",
      "example": "事件の犯人を特定する。",
      "exampleMeaning": "Xác định hung thủ của vụ án."
    }
  ]
}