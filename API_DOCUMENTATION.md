# Alumni Management System - API Documentation

## Base URL
```
https://your-domain.com/api
```

## Authentication
Most endpoints require authentication using Laravel Sanctum tokens. Include the token in the Authorization header:
```
Authorization: Bearer your_token_here
```

---

## Authentication Endpoints

### 1. Login
**POST** `/alumni/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "user": {
    "id": "1",
    "fullName": "John Doe",
    "email": "user@example.com",
    "sscYear": "2015",
    "hscYear": "2017",
    "attendanceFromYear": "2018",
    "attendanceToYear": "2022",
    "profilePhoto": "/storage/profile_photos/photo.jpg",
    "isAuthenticated": true,
    "isAdmin": false,
    "isDemoUser": false,
    "profile": {
      "profilePicture": "/storage/profile_pictures/pic.jpg",
      "bio": "Software Engineer passionate about technology",
      "profession": "Software Engineer",
      "organization": "Tech Corp",
      "organizationWebsite": "https://techcorp.com",
      "jobTitle": "Senior Developer",
      "city": "Dhaka",
      "country": "Bangladesh",
      "permanentAddress": "123 Main St, Dhaka",
      "sameAsCurrentAddress": true,
      "phoneNumber": "+8801234567890",
      "showPhone": true,
      "dateOfBirth": "1995-01-15T00:00:00.000Z",
      "expertise": ["JavaScript", "Laravel", "React"],
      "socialLinks": {
        "facebook": "https://facebook.com/johndoe",
        "linkedin": "https://linkedin.com/in/johndoe",
        "twitter": "https://twitter.com/johndoe"
      },
      "willingToMentor": true,
      "mentorshipAreas": ["Web Development", "Career Guidance"],
      "aboutMe": "Experienced developer with 5+ years in the industry",
      "hallOfFameOptIn": true,
      "hallOfFameBio": "Alumni success story bio",
      "education": [
        {
          "degree": "BSc in Computer Science",
          "institution": "University of Dhaka",
          "year": "2022"
        }
      ],
      "workExperience": [
        {
          "company": "Tech Corp",
          "position": "Senior Developer",
          "duration": "2022-Present"
        }
      ],
      "profileCompletionScore": 85
    },
    "hasMembership": true,
    "dateJoined": "2024-01-15T10:30:00.000Z",
    "approvalStatus": "approved",
    "socialProfileLink": "https://linkedin.com/in/johndoe",
    "countryCode": "+880",
    "phoneNumber": "1234567890"
  },
  "token": "your_access_token_here",
  "message": "Login successful"
}
```

### 2. Register
**POST** `/alumni/register`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "passwordConfirmation": "password123",
  "sscYear": "2015",
  "hscYear": "2017",
  "attendanceFromYear": "2018",
  "attendanceToYear": "2022",
  "countryCode": "+880",
  "phoneNumber": "1234567890"
}
```

**Response (Success - 201):**
```json
{
  "user": {
    // Same user object structure as login
  },
  "token": "your_access_token_here",
  "message": "Registration successful"
}
```

### 3. Forgot Password
**POST** `/alumni/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success - 200):**
```json
{
  "message": "Password reset link sent to your email"
}
```

### 4. Reset Password
**POST** `/alumni/reset-password`

**Request Body:**
```json
{
  "email": "user@example.com",
  "token": "reset_token_from_email",
  "password": "new_password123",
  "passwordConfirmation": "new_password123"
}
```

**Response (Success - 200):**
```json
{
  "message": "Password reset successful"
}
```

---

## Protected Endpoints (Require Authentication)

### 5. Logout
**POST** `/alumni/logout`

**Headers:**
```
Authorization: Bearer your_token_here
```

**Response (Success - 200):**
```json
{
  "message": "Logged out successfully"
}
```

### 6. Refresh Token
**POST** `/alumni/refresh`

**Headers:**
```
Authorization: Bearer your_token_here
```

**Response (Success - 200):**
```json
{
  "token": "new_access_token_here",
  "message": "Token refreshed successfully"
}
```

### 7. Get Current User
**GET** `/alumni/me`

**Headers:**
```
Authorization: Bearer your_token_here
```

**Response (Success - 200):**
```json
{
  "user": {
    // Same user object structure as login
  }
}
```

---

## User Profile Endpoints

### 8. Get User Profile
**GET** `/alumni/{id}`

**Headers:**
```
Authorization: Bearer your_token_here
```

**Response (Success - 200):**
```json
{
  "user": {
    // Same user object structure as login
  }
}
```

### 9. Update User Profile
**PUT** `/alumni/{id}/profile`

**Headers:**
```
Authorization: Bearer your_token_here
Content-Type: application/json
```

**Request Body:**
```json
{
  "bio": "Updated bio text",
  "profession": "Senior Software Engineer",
  "organization": "New Tech Company",
  "organizationWebsite": "https://newtechcompany.com",
  "jobTitle": "Lead Developer",
  "city": "Dhaka",
  "country": "Bangladesh",
  "permanentAddress": "456 New Street, Dhaka",
  "sameAsCurrentAddress": false,
  "phoneNumber": "+8801987654321",
  "showPhone": true,
  "dateOfBirth": "1995-01-15",
  "expertise": ["JavaScript", "Laravel", "React", "Vue.js"],
  "socialLinks": {
    "facebook": "https://facebook.com/johndoe",
    "linkedin": "https://linkedin.com/in/johndoe",
    "twitter": "https://twitter.com/johndoe",
    "instagram": "https://instagram.com/johndoe",
    "website": "https://johndoe.dev"
  },
  "willingToMentor": true,
  "mentorshipAreas": ["Web Development", "Career Guidance", "Technical Leadership"],
  "aboutMe": "Experienced full-stack developer with expertise in modern web technologies",
  "hallOfFameOptIn": true,
  "hallOfFameBio": "John is a distinguished alumnus who has made significant contributions to the tech industry",
  "education": [
    {
      "degree": "BSc in Computer Science",
      "institution": "University of Dhaka",
      "year": "2022"
    }
  ],
  "workExperience": [
    {
      "company": "New Tech Company",
      "position": "Lead Developer",
      "duration": "2023-Present"
    }
  ]
}
```

**Response (Success - 200):**
```json
{
  "user": {
    // Updated user object with new profile data
  },
  "message": "Profile updated successfully"
}
```

### 10. Get Profile Completion Status
**GET** `/alumni/{id}/completion-status`

**Headers:**
```
Authorization: Bearer your_token_here
```

**Response (Success - 200):**
```json
{
  "profileCompletionScore": 85,
  "missingFields": ["Date of Birth", "Permanent Address"],
  "completedSections": {
    "basicInfo": true,
    "contactInfo": true,
    "professionalInfo": true,
    "socialLinks": true,
    "mentorship": false
  }
}
```

### 11. Upload Profile Picture
**POST** `/alumni/{id}/profile-picture`

**Headers:**
```
Authorization: Bearer your_token_here
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
profile_picture: [image file] (JPEG, PNG, JPG, GIF, max 2MB)
```

**Response (Success - 200):**
```json
{
  "profilePicture": "/storage/profile_pictures/1234567890_photo.jpg",
  "message": "Profile picture uploaded successfully"
}
```

### 12. Delete Profile Picture
**DELETE** `/alumni/{id}/profile-picture`

**Headers:**
```
Authorization: Bearer your_token_here
```

**Response (Success - 200):**
```json
{
  "message": "Profile picture deleted successfully"
}
```

---

## Error Responses

### Validation Error (422)
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  }
}
```

### Authentication Error (401)
```json
{
  "message": "Unauthenticated."
}
```

### Authorization Error (403)
```json
{
  "message": "Unauthorized"
}
```

### Not Found Error (404)
```json
{
  "message": "Resource not found"
}
```

### Server Error (500)
```json
{
  "message": "Internal server error"
}
```

---

## Field Validation Rules

### Registration/Login Fields
- **fullName**: Required, string, max 255 characters
- **email**: Required, valid email format, unique
- **password**: Required, string, min 8 characters
- **sscYear**: Required, numeric, 4 digits
- **hscYear**: Required, numeric, 4 digits
- **attendanceFromYear**: Required, numeric, 4 digits
- **attendanceToYear**: Required, numeric, 4 digits
- **countryCode**: Required, string, max 10 characters
- **phoneNumber**: Required, string, max 20 characters

### Profile Update Fields
- **bio**: Optional, string, max 1000 characters
- **profession**: Optional, string, max 255 characters
- **organization**: Optional, string, max 255 characters
- **organizationWebsite**: Optional, valid URL, max 255 characters
- **jobTitle**: Optional, string, max 255 characters
- **city**: Optional, string, max 255 characters
- **country**: Optional, string, max 255 characters
- **permanentAddress**: Optional, string, max 500 characters
- **sameAsCurrentAddress**: Optional, boolean
- **phoneNumber**: Optional, string, max 20 characters
- **showPhone**: Optional, boolean
- **dateOfBirth**: Optional, valid date
- **expertise**: Optional, array of strings (max 100 chars each)
- **socialLinks**: Optional, object with valid URLs
- **willingToMentor**: Optional, boolean
- **mentorshipAreas**: Optional, array of strings (max 100 chars each)
- **aboutMe**: Optional, string, max 1000 characters
- **hallOfFameOptIn**: Optional, boolean
- **hallOfFameBio**: Optional, string, max 500 characters
- **education**: Optional, array of objects
- **workExperience**: Optional, array of objects

### Profile Picture Upload
- **profile_picture**: Required, image file (JPEG, PNG, JPG, GIF), max 2MB

---

## Notes

1. All responses use camelCase field naming convention
2. Date fields are returned in ISO 8601 format with `.000Z` suffix
3. File uploads are stored in the `public/storage` directory
4. Profile completion score is automatically calculated based on filled fields
5. Users can only update their own profiles unless they are admin users
6. Social links object supports: facebook, linkedin, twitter, instagram, youtube, website
7. Expertise and mentorship areas are stored as JSON arrays
8. Education and work experience are stored as JSON arrays of objects
