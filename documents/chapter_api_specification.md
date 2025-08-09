6.2 Chapter APIs
Method
Endpoint
Description
POST
/api/Chapter
Thêm chapter mới 
PUT
/api/Chapter/{id}
Cập nhật chapter
DELETE
/api/Chapter/{id}
Xoá chapter


6.2.1 POST /api/Chapter
🔹 API: POST /api/Chapter
Description: Tạo chương tạo mới
Auth: Administrator
🔹 Payload:
{
    "title": "JLPT N5",
    "description": "Khóa học này dành cho: Người mới\n",
    "ỏder": 4,
    "isLock": false,
    "courseId": 8,
    "lessons":[
        {
            "title": "Bảng chữ cái Hiragana",
            "order": 1,
            "type": 0,
            "resourceId": 3,
            "chapterId": null
        }
    ]
}


🔹 Status Codes:
201: Created
400: Bad Request
401: Unauthorized
500: Internal Server Error

6.2.2 PUT /api/Chapter/{id}
🔹 API: PUT /api/Chapter/{id}
Description: Cập nhật chương học
Auth: Administrator
🔹 Payload:
{
    "title": "JLPT N5",
    "description": "Khóa học này dành cho: Người mới\n",
    "order": null,
    "isLock": true,
    "courseId": 8
}

🔹 Status Codes:
204: No Content
400: Bad Request
401: Unauthorized
404: Not Found Exception
500: Internal Server Error

6.2.3 DELETE /api/Chapter/{id}
🔹 API: DELETE /api/Chapter/{id}
Description: Xoá khoá học
Auth: Administrator
🔹 Status Codes:
204: No Content
401: Unauthorized
404: Not Found Exception
500: Internal Server Error
