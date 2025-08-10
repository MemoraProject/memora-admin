6. API Specification
File Postman: 
6.1 Course APIs
Method
Endpoint
Description
GET
/api/Course
Lấy danh sách tất cả khoá học
GET
/api/Course/own
Lấy danh sách khóa học đã đăng lên
GET
/api/Course/my-course
Lấy danh sách khóa học đã đăng ký
GET
/api/Course/{id}
Lấy thông tin chi tiết khóa học
POST
/api/Course
Tạo khoá học mới 
PUT
/api/Course/{id}
Cập nhật khoá học 
DELETE
/api/Course/{id}
Xoá khoá học 


6.1.1 GET /api/Course
🔹 API: GET /api/Course
Description: Lấy danh sách tất cả các khoá học
Auth: Administrator, User
Query Params:
OrderBy(all, newest, oldest): lọc theo từ khoá
SearchTerm: phân trang
PageNumber: lọc theo từ khoá
PageSize: phân trang
🔹 Response:
{
  "data": [
    {
      "id": 10,
      "title": "JLPT N5",
      "description": "Khóa học này dành cho: Người mới bắt đầu học tiếng Nhật\n",
      "imgUrl": null,
      "videoUrl": "string",
      "difficultLevel": "1",
      "price": 100000,
      "isPublic": true,
      "identitfier": null,
      "totalChapter": 0,
      "totalLesson": 0,
      "processing": 0,
      "createdBy": "Admin001",
      "dateCreated": "2025-07-18T10:28:22.120102",
      "dateModified": "2025-07-18T10:28:44.702791",
      "chapters": []
    },
    {
      "id": 8,
      "title": "Ôn FE JPD113",
      "description": "Ôn thi cấp tốc môn JPD113",
      "imgUrl": null,
      "videoUrl": "",
      "difficultLevel": "N5",
      "price": 250000,
      "isPublic": true,
      "identitfier": "course_n5_beginner",
      "totalChapter": 2,
      "totalLesson": 5,
      "processing": 0,
      "createdBy": "Admin001",
      "dateCreated": "2025-03-20T01:50:33.006",
      "dateModified": "2025-03-20T01:50:33.006",
      "chapters": []
    }
  ]
}

🔹 Status Codes:
200: OK
401: Unauthorized
500: Internal Server Error

6.1.2 GET /api/Course/own
🔹 API: GET /api/Course/own
Description: Lấy danh sách khóa học đã đăng lên
Auth: Administrator, User
Query Params:
OrderBy(all, newest, oldest): lọc theo từ khoá
SearchTerm: phân trang
PageNumber: lọc theo từ khoá
PageSize: phân trang
🔹 Response:
{
  "data": [
    {
      "id": 10,
      "title": "JLPT N5",
      "description": "Khóa học này dành cho: Người mới bắt đầu học tiếng Nhật\n",
      "imgUrl": null,
      "videoUrl": "string",
      "difficultLevel": "1",
      "price": 100000,
      "isPublic": true,
      "identitfier": null,
      "totalChapter": 0,
      "totalLesson": 0,
      "processing": 0,
      "createdBy": "Admin001",
      "dateCreated": "2025-07-18T10:28:22.120102",
      "dateModified": "2025-07-18T10:28:44.702791",
      "chapters": []
    },
    {
      "id": 8,
      "title": "Ôn FE JPD113",
      "description": "Ôn thi cấp tốc môn JPD113",
      "imgUrl": null,
      "videoUrl": "",
      "difficultLevel": "N5",
      "price": 250000,
      "isPublic": true,
      "identitfier": "course_n5_beginner",
      "totalChapter": 2,
      "totalLesson": 5,
      "processing": 0,
      "createdBy": "Admin001",
      "dateCreated": "2025-03-20T01:50:33.006",
      "dateModified": "2025-03-20T01:50:33.006",
      "chapters": []
    }
  ]
}

🔹 Status Codes:
200: OK
401: Unauthorized
500: Internal Server Error
6.1.3 GET /api/Course/my-course
🔹 API: GET /api/Course/my-course
Description: Lấy danh sách khóa học đã đăng ký
Auth: Administrator, User
Query Params:
OrderBy(all, newest, oldest): lọc theo từ khoá
SearchTerm: phân trang
PageNumber: lọc theo từ khoá
PageSize: phân trang
🔹 Response:
{
  "data": [
    {
      "id": 10,
      "title": "JLPT N5",
      "description": "Khóa học này dành cho: Người mới bắt đầu học tiếng Nhật\n",
      "imgUrl": null,
      "videoUrl": "string",
      "difficultLevel": "1",
      "price": 100000,
      "isPublic": true,
      "identitfier": null,
      "totalChapter": 0,
      "totalLesson": 0,
      "processing": 0,
      "createdBy": "Admin001",
      "dateCreated": "2025-07-18T10:28:22.120102",
      "dateModified": "2025-07-18T10:28:44.702791",
      "chapters": []
    },
    {
      "id": 8,
      "title": "Ôn FE JPD113",
      "description": "Ôn thi cấp tốc môn JPD113",
      "imgUrl": null,
      "videoUrl": "",
      "difficultLevel": "N5",
      "price": 250000,
      "isPublic": true,
      "identitfier": "course_n5_beginner",
      "totalChapter": 2,
      "totalLesson": 5,
      "processing": 0,
      "createdBy": "Admin001",
      "dateCreated": "2025-03-20T01:50:33.006",
      "dateModified": "2025-03-20T01:50:33.006",
      "chapters": []
    }
  ]
}

🔹 Status Codes:
200: OK
401: Unauthorized
500: Internal Server Error

6.1.4 GET /api/Course/{id}
🔹 API: GET /api/Course/{id}
Description: Lấy danh sách khóa học đã đăng lên
Auth: Administrator, User
🔹 Response:
{
  "id": 8,
  "title": "Ôn FE JPD113",
  "description": "Ôn thi cấp tốc môn JPD113",
  "imgUrl": null,
  "videoUrl": "",
  "difficultLevel": "N5",
  "price": 250000,
  "isPublic": true,
  "identitfier": "course_n5_beginner",
  "totalChapter": 0,
  "totalLesson": 0,
  "processing": 0,
  "createdBy": "Admin001",
  "dateCreated": "2025-03-20T01:50:33.006",
  "dateModified": "2025-03-20T01:50:33.006",
  "chapters": [
    {
      "title": "Ôn tập buổi 1",
      "description": "Bảng chữ cái, ôn tập từ vựng  ngữ phápbài 1 và 2",
      "order": 1,
      "courseId": 8,
      "totalCompleteLesson": 0,
      "totalLesson": 3,
      "lessons": [
        {
          "title": "Bảng chữ cái Hiragana",
          "order": 1,
          "description": null,
          "isLock": false,
          "type": 0,
          "resourceId": 3,
          "studySet": null,
          "quiz": null,
          "video": {
            "url": "videos/video_demo.mp4",
            "duration": 3,
            "id": 3,
            "dateCreated": "2025-03-20T01:50:33.006",
            "dateModified": "2025-03-20T01:50:33.006",
            "deletedAt": null,
            "createdBy": null,
            "modifiedBy": null
          },
          "document": null,
          "chapterId": 5,
          "lessonTracking": null,
          "id": 6,
          "dateCreated": "2025-03-20T01:50:33.006",
          "dateModified": "2025-03-20T01:50:33.006",
          "deletedAt": null,
          "createdBy": "Admin001",
          "modifiedBy": "Admin001"
        },
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
      ],
      "id": 5,
      "dateCreated": "2025-03-20T01:50:33.006",
      "dateModified": "2025-03-20T01:50:33.006",
      "deletedAt": null,
      "createdBy": "Admin001",
      "modifiedBy": "Admin001"
    },
    {
      "title": "Ôn tập buổi 2",
      "description": "Ôn tập từ vựng, ngữ pháp bài 3, 4",
      "order": 2,
      "courseId": 8,
      "totalCompleteLesson": 0,
      "totalLesson": 2,
      "lessons": [
        {
          "title": "Ôn tập bài 4",
          "order": 3,
          "description": null,
          "isLock": false,
          "type": 2,
          "resourceId": 18,
          "studySet": null,
          "quiz": {
            "id": 18,
            "keyword": "DEFAULT KEYWORD",
            "name": "日本語の簡単な試験",
            "isPublic": false,
            "imgUrl": "https://firebasestorage.googleapis.com/v0/b/memora-88270.appspot.com/o/memora_default_thumbnail%2Fmemora_thumbnail_5.jpg?alt=media&token=c7c3946a-9709-47c1-97d6-88bc4d8ee9c1",
            "sourceType": 0,
            "quizQuestions": [],
            "results": [],
            "totalQuestion": 0,
            "isCloned": false,
            "createdBy": null,
            "dateCreated": "2024-10-19T13:06:36.727941",
            "user": null
          },
          "video": null,
          "document": null,
          "chapterId": 6,
          "lessonTracking": null,
          "id": 10,
          "dateCreated": "2025-03-20T01:50:33.006",
          "dateModified": "2025-03-20T01:50:33.006",
          "deletedAt": null,
          "createdBy": "Admin001",
          "modifiedBy": "Admin001"
        },
        {
          "title": "Ôn tập bài 3",
          "order": 4,
          "description": null,
          "isLock": false,
          "type": 0,
          "resourceId": 4,
          "studySet": null,
          "quiz": null,
          "video": {
            "url": "videos/video_demo.mp4",
            "duration": 3,
            "id": 4,
            "dateCreated": "2025-03-20T01:50:33.006",
            "dateModified": "2025-03-20T01:50:33.006",
            "deletedAt": null,
            "createdBy": null,
            "modifiedBy": null
          },
          "document": null,
          "chapterId": 6,
          "lessonTracking": null,
          "id": 9,
          "dateCreated": "2025-03-20T01:50:33.006",
          "dateModified": "2025-03-20T01:50:33.006",
          "deletedAt": null,
          "createdBy": "Admin001",
          "modifiedBy": "Admin001"
        }
      ],
      "id": 6,
      "dateCreated": "2025-03-20T01:50:33.006",
      "dateModified": "2025-03-20T01:50:33.006",
      "deletedAt": null,
      "createdBy": "Admin001",
      "modifiedBy": "Admin001"
    }
  ]
}

🔹 Status Codes:
200: OK
401: Unauthorized
404: Not Found Exception
500: Internal Server Error

6.1.5 POST /api/Course
🔹 API: POST /api/Course
Description: Tạo khoá học mới
Auth: Administrator
🔹 Payload:
{
  "title": "Course Test 01",
    "description": "none",
"imgurl": null,
    "videoUrl": null,
    "difficultLevel": null,
    "price": 150000,
    "isPublic": false,
  "identitfier": "course_test_01",
  "chapters": [
    {
      "title": "Chapter 1",
      "description": "string stringstringstringstring string",
      "order": 1
    },
    {
      "title": "Chapter 2",
      "description": "string stringstringstringstring string",
      "order": 2
    },
    {
      "title": "Chapter 3",
      "description": "string stringstringstringstring string",
      "order": 3
    }
  ]
}

🔹 Status Codes:
201: Created
400: Bad Request
401: Unauthorized
500: Internal Server Error

6.1.6 PUT /api/Course/{id}
🔹 API: PUT /api/Course/{id}
Description: Cập nhật khoá học
Auth: Administrator
🔹 Payload:
{
  "title": "Course Test 02 Update",
    "description": "none",
"imgurl": null,
    "videoUrl": null,
    "difficultLevel": null,
    "price": 150000,
    "isPublic": false,
  "identitfier": "course_test_01",
  "chapters": [
    {
      "id": 20,
      "title": "Chapter 1 Update",
      "description": "string stringstringstringstring string",
      "order": 1
    },
    {
      "id": 21,
      "title": "Chapter 2",
      "description": "string string",
      "order": 2
    },
    {
      "id": 22,
      "title": "Chapter 3",
      "description": "string stringstringstringstring string",
      "order": 4
    }
  ]
}

🔹 Status Codes:
204: No Content
400: Bad Request
401: Unauthorized
404: Not Found
500: Internal Server Error

6.1.7 DELETE /api/Course/{id}
🔹 API: DELETE /api/Course/{id}
Description: Xoá khoá học
Auth: Administrator
🔹 Status Codes:
204: No Content
401: Unauthorized
404: Not Found
500: Internal Server Error
