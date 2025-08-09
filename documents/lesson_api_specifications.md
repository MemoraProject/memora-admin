6.3 Lesson API
Method
Endpoint
Description
GET
/api/Lesson/{id}
Lấy chi tiết lesson
POST
/api/Lesson/{id}
Thêm lesson mới 
PUT
/api/Lesson/{id}
Cập nhật lesson
DELETE
/api/Lesson/{id}
Xoá lesson
GET
/api/Video/{id}
Lấy chi tiết Video
GET
/api/Document/{id}
Lấy chi tiết Document

6.3.1 GET /api/Lesson/{id}
🔹 API: GET /api/Lesson/{id}
Description: Lấy chi tiết Lesson
Auth: Administrator, User
🔹 Response:
{
  "title": "Bảng chữ cái Katakana",
  "order": 2,
  "description": null,
  "isLock": false,
  "type": 1,
  "resourceId": 163,
  "studySet": {
    "id": 163,
    "keyword": "DEFAULT KEYWORD",
    "name": "AUDIO",
    "isPublic": false,
    "imgUrl": null,
    "aiGeneratedId": null,
    "sourceType": 0,
    "totalCard": 0,
    "learnedCards": 0,
    "isCloned": false,
    "createdBy": "Admin001",
    "dateCreated": "2025-02-26T21:00:00.970753",
    "user": null
  },
  "quiz": null,
  "video": null,
  "document": null,
  "chapterId": 5,
  "lessonTracking": null,
  "id": 7,
  "dateCreated": "2025-03-20T01:50:33.006",
  "dateModified": "2025-03-20T01:50:33.006",
  "deletedAt": null,
  "createdBy": "Admin001",
  "modifiedBy": "Admin001"
}

🔹 Status Codes:
200: OK
401: Unauthorized
404: Not Found
500: Internal Server Error

6.3.2 POST /api/Lesson/{id}
🔹 API: POST /api/Lesson/{id}
Description: Thêm lesson mới
Auth: Administrator
🔹 Response:
StudySet
{
  "title": "string",
  "order": 0,
  "description": "string",
  "type": 1,
  "chapterId": 5,
  "studySet": {
    "keyword": "string",
    "name": "string",
    "isPublic": true,
    "imgUrl": "string",
    "aiGeneratedId": 0,
    "folderId": null,
    "userId": "Admin001",
    "cards": [
      {
        "word": "出る",
        "pronounce": "string",
        "ranking": 0,
        "sinoVietnamese": "string",
        "type": "string",
        "meaningDescription": "string",
        "example": "string",
        "exampleMeaning": "string",
        "meaning": "đi ra, rời khỏi",
        "order": 1,
        "imgUrl": "string",
        "cardSounds": [
          {
            "type": "string",
            "slowAudioUrl": "string",
            "normalAudioUrl": "string",
            "fastAudioUrl": "string"
          }
        ]
      },
      {
        "word": "使う",
        "pronounce": "string",
        "ranking": 0,
        "sinoVietnamese": "string",
        "type": "string",
        "meaningDescription": "string",
        "example": "string",
        "exampleMeaning": "string",
        "meaning": "sử dụng",
        "order": 1,
        "imgUrl": "string",
        "cardSounds": [
          {
            "type": "string",
            "slowAudioUrl": "string",
            "normalAudioUrl": "string",
            "fastAudioUrl": "string"
          }
        ]
      }
    ]
  },
  "quiz": null,
  "video": null,
  "document": null
}


Quiz
{
  "title": "string",
  "order": 0,
  "description": "string",
  "type": 2,
  "chapterId": 5,
  "studySet": null,
  "quiz": {
    "keyword": "Test course quiz",
    "name": "Test course quiz",
    "isPublic": true,
    "imgUrl": "string",
    "sourceType": 2,
    "folderId": null,
    "userId": "Admin001",
    "quizQuestions": [
      {
        "type": 1,
        "question": "string test 01",
        "explaination": "string string string",
        "order": 1,
        "quizOptions": [
          {
            "optionText": "string 1",
            "optionImage": "string",
            "isCorrect": true
          },
          {
            "optionText": "string 2",
            "optionImage": "string",
            "isCorrect": false
          },
          {
            "optionText": "string 3",
            "optionImage": "string",
            "isCorrect": false
          },
          {
            "optionText": "string 4",
            "optionImage": "string",
            "isCorrect": false
          }
        ]
      }
    ]
  },
  "video": null,
  "document": null
}


Video
{
  "title": "string",
  "order": 0,
  "description": "string",
  "type": 0,
  "chapterId": 5,

  "studySet": null,
  "quiz": null,
  "video": {
    "url": "testurl.com",
    "duration": 2
  },
  "document": null
}


Document
{
  "title": "string",
  "order": 0,
  "description": "string",
  "type": 3,
  "resourceId": 0,
  "chapterId": 5,
  "studySet": null,
  "quiz": null,
  "video": null,
  "document": {
    "title": "string",
    "content": "string"
  }
}

🔹 Status Codes:
200: OK
401: Unauthorized
500: Internal Server Error

6.3.3 PUT /api/Lesson/{id}
🔹 API: PUT /api/Lesson/{id}
Description: Cập nhật lesson
Auth: Administrator
🔹 Response:
StudySet
{
  "title": "string",
  "order": 0,
  "description": "string",
  "type": 1,
  "resourceId": 347,
  "chapterId": 5,
  "studySet": {
    "keyword": "string",
    "name": "string",
    "isPublic": true,
    "imgUrl": "string",
    "aiGeneratedId": 0,
    "folderId": null,
    "userId": "Admin001",
    "cards": [
      {
"id": 5110,
        "word": "出る",
        "pronounce": "string",
        "ranking": 0,
        "sinoVietnamese": "string",
        "type": "string",
        "meaningDescription": "string",
        "example": "string",
        "exampleMeaning": "string",
        "meaning": "đi ra, rời khỏi",
        "order": 1,
        "imgUrl": "string",
        "cardSounds": [
          {
            "type": "string",
            "slowAudioUrl": "string",
            "normalAudioUrl": "string",
            "fastAudioUrl": "string"
          }
        ]
      },
      {
"id": 5111,
        "word": "使う",
        "pronounce": "string",
        "ranking": 0,
        "sinoVietnamese": "string",
        "type": "string",
        "meaningDescription": "string",
        "example": "string",
        "exampleMeaning": "string",
        "meaning": "sử dụng",
        "order": 2,
        "imgUrl": "string",
        "cardSounds": [
          {
            "type": "string",
            "slowAudioUrl": "string",
            "normalAudioUrl": "string",
            "fastAudioUrl": "string"
          }
        ]
      }
    ]
  },
  "quiz": null,
  "video": null,
  "document": null
}


Quiz
{
  "title": "string",
  "order": 0,
  "description": "string",
  "type": 2,
  "resourceId": 75,
  "chapterId": 5,
  "studySet": null,
  "quiz": {
    "keyword": "Test course quiz",
    "name": "Test course quiz",
    "isPublic": true,
    "imgUrl": "string",
    "folderId": null,
    "userId": "Admin001",
    "quizQuestions": [
      {
        "id": 295,
        "type": 1,
        "question": "string test 01",
        "explaination": "string string string",
        "order": 1,
        "quizOptions": [
          {
            "id": 1004,
            "optionText": "string 1",
            "optionImage": "string",
            "isCorrect": false
          },
          {
            "id": 1005,
            "optionText": "string 2",
            "optionImage": "string",
            "isCorrect": true
          },
          {
            "id": 1006,
            "optionText": "string 3",
            "optionImage": "string",
            "isCorrect": false
          },
          {
            "id": 1007,
            "optionText": "string 4",
            "optionImage": "string",
            "isCorrect": false
          }
        ]
      }
    ]
  },
  "video": null,
  "document": null
}


Video
{
  "title": "string",
  "order": 0,
  "description": "string",
  "type": 0,
  "chapterId": 5,
  "resourceId": 5,
  "studySet": null,
  "quiz": null,
  "video": {
    "url": "testurl.com",
    "duration": 2
  },
  "document": null
}


Document
{
  "title": "string",
  "order": 0,
  "description": "string",
  "type": 3,
  "resourceId": 0,
  "chapterId": 5,
  "studySet": null,
  "quiz": null,
  "video": null,
  "document": {
    "title": "string",
    "content": "string"
  }
}

🔹 Status Codes:
200: OK
401: Unauthorized
500: Internal Server Error

6.3.4 DELETE /api/Lesson/{id}
🔹 API: GET /api/Lesson/{id}
Description: Xoá lesson
Auth: Administrator
🔹 Status Codes:
204: No Content
401: Unauthorized
404: Not Found Exception
500: Internal Server Error

6.3.5 GET /api/Video/{id}
🔹 API: GET /api/Video/{id}
Description: Lấy chi tiết Video
Auth: Administrator, User
🔹 Response:
{
    "data": {
        "url": "videos/video_demo.mp4",
        "duration": 3,
        "id": 1,
        "dateCreated": "2025-02-02T10:10:34.763",
        "dateModified": "2025-02-02T10:10:34.763",
        "deletedAt": null,
        "createdBy": null,
        "modifiedBy": null
    }
}

🔹 Status Codes:
200: OK
401: Unauthorized
500: Internal Server Error

6.3.6 GET /api/Document/{id}
🔹 API: GET /api/Document/{id}
Description: Lấy chi tiết Document
Auth: Administrator, User
🔹 Response:
{
    "data": {
        "title": "abc",
        "content": "abc",
        "id": 1,
        "dateCreated": "2025-02-02T10:10:34.763",
        "dateModified": "2025-02-02T10:10:34.763",
        "deletedAt": null,
        "createdBy": null,
        "modifiedBy": null
    }
}

