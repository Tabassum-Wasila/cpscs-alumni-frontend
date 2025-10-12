# Frontend API Data Formats Documentation

This document specifies the EXACT data formats that the frontend expects from the Laravel backend API and the formats it sends in requests. All field names and data types are precisely defined to ensure perfect compatibility.

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [User Profile APIs](#user-profile-apis)
3. [Data Type Definitions](#data-type-definitions)
4. [API Function Reference](#api-function-reference)

---

## Authentication APIs

### 1. User Registration

**Function:** `AuthService.register()`  
**Location:** `src/services/authService.ts`  
**API Endpoint:** `POST /alumni/register`

#### Request Format (Frontend sends to Backend):
```json
{
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "ssc_year": "2015",
  "hsc_year": "2017",
  "phone_number": "1234567890",
  "country_code": "+880",
  "attendance_from_year": "2013",
  "attendance_to_year": "2015"
}
```

#### Response Format (Backend returns to Frontend):
```json
{
  "user": {
    "id": "1",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "sscYear": "2015",
    "hscYear": "2017",
    "attendanceFromYear": "2013",
    "attendanceToYear": "2015",
    "profilePhoto": "",
    "isAuthenticated": true,
    "isAdmin": false,
    "isDemoUser": false,
    "hasMembership": false,
    "dateJoined": "2023-10-15T10:30:00Z",
    "approvalStatus": "pending",
    "countryCode": "+880",
    "phoneNumber": "1234567890",
    "socialProfileLink": "",
    "profile": {
      "profilePicture": "",
      "bio": "",
      "profession": "",
      "organization": "",
      "organizationWebsite": "",
      "jobTitle": "",
      "city": "",
      "country": "",
      "permanentAddress": "",
      "sameAsCurrentAddress": false,
      "countryCode": "+880",
      "phoneNumber": "1234567890",
      "showPhone": true,
      "dateOfBirth": "",
      "expertise": [],
      "socialLinks": {
        "facebook": "",
        "linkedin": "",
        "youtube": "",
        "twitter": "",
        "instagram": "",
        "website": ""
      },
      "willingToMentor": false,
      "mentorshipAreas": [],
      "aboutMe": "",
      "hallOfFameOptIn": false,
      "hallOfFameBio": "",
      "education": [],
      "workExperience": [],
      "profileCompletionScore": 0
    }
  },
  "token": "your_jwt_token_here",
  "message": "Registration successful"
}
```

### 2. User Login

**Function:** `AuthService.login()`  
**Location:** `src/services/authService.ts`  
**API Endpoint:** `POST /alumni/login`

#### Request Format:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

#### Response Format:
```json
{
  "user": {
    "id": "1",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "sscYear": "2015",
    "hscYear": "2017",
    "attendanceFromYear": "2013",
    "attendanceToYear": "2015",
    "profilePhoto": "/storage/profile_pictures/user1.jpg",
    "isAuthenticated": true,
    "isAdmin": false,
    "isDemoUser": false,
    "hasMembership": true,
    "dateJoined": "2023-10-15T10:30:00Z",
    "approvalStatus": "approved",
    "countryCode": "+880",
    "phoneNumber": "1234567890",
    "socialProfileLink": "https://linkedin.com/in/johndoe",
    "profile": {
      "profilePicture": "/storage/profile_pictures/user1.jpg",
      "bio": "Software Engineer passionate about technology",
      "profession": "Software Engineer",
      "organization": "Tech Company Ltd",
      "organizationWebsite": "https://techcompany.com",
      "jobTitle": "Senior Software Engineer",
      "city": "Dhaka",
      "country": "Bangladesh",
      "permanentAddress": "123 Main St, Dhaka, Bangladesh",
      "sameAsCurrentAddress": false,
      "countryCode": "+880",
      "phoneNumber": "1234567890",
      "showPhone": true,
      "dateOfBirth": "1995-05-15",
      "expertise": ["React", "Node.js", "TypeScript"],
      "socialLinks": {
        "facebook": "https://facebook.com/johndoe",
        "linkedin": "https://linkedin.com/in/johndoe",
        "youtube": "",
        "twitter": "https://twitter.com/johndoe",
        "instagram": "",
        "website": "https://johndoe.dev"
      },
      "willingToMentor": true,
      "mentorshipAreas": ["Web Development", "Career Guidance"],
      "aboutMe": "Passionate about mentoring young developers...",
      "hallOfFameOptIn": true,
      "hallOfFameBio": "Achievement description for hall of fame",
      "education": [
        {
          "id": "edu1",
          "degree": "SSC",
          "institution": "Cantonment Public School and College",
          "graduationYear": "2015",
          "department": "Science",
          "isDefault": true
        }
      ],
      "workExperience": [
        {
          "id": "work1",
          "title": "Senior Software Engineer",
          "company": "Tech Company Ltd",
          "startDate": "2020-01-15",
          "endDate": "",
          "isCurrent": true,
          "description": "Leading frontend development team..."
        }
      ],
      "profileCompletionScore": 85
    }
  },
  "token": "your_jwt_token_here",
  "message": "Login successful"
}
```

### 3. Get Current User

**Function:** `AuthService.getCurrentUserFromAPI()`  
**Location:** `src/services/authService.ts`  
**API Endpoint:** `GET /alumni/me`

#### Request Format:
Headers only (Authorization: Bearer token)

#### Response Format:
Same as login response (user object with complete profile)

### 4. Logout

**Function:** `AuthService.logout()`  
**Location:** `src/services/authService.ts`  
**API Endpoint:** `POST /alumni/logout`

#### Request Format:
Headers only (Authorization: Bearer token)

#### Response Format:
```json
{
  "message": "Logout successful"
}
```

### 5. Token Refresh

**Function:** `AuthService.refreshToken()`  
**Location:** `src/services/authService.ts`  
**API Endpoint:** `POST /alumni/refresh`

#### Request Format:
Headers only (Authorization: Bearer token)

#### Response Format:
```json
{
  "token": "new_jwt_token_here",
  "message": "Token refreshed successfully"
}
```

---

## User Profile APIs

### 1. Get User Profile by ID

**Function:** `UserService.getUserProfile()`  
**Location:** `src/services/userService.ts`  
**API Endpoint:** `GET /alumni/{id}`

#### Request Format:
URL parameter: userId  
Headers: Authorization: Bearer token

#### Response Format:
```json
{
  "user": {
    // Same complete user object as login response
  }
}
```

### 2. Update User Profile

**Function:** `UserService.updateProfile()`  
**Location:** `src/services/userService.ts`  
**API Endpoint:** `PUT /alumni/{id}/profile`

#### Request Format (Frontend sends to Backend):
```json
{
  "profilePicture": "/storage/profile_pictures/user1.jpg",
  "bio": "Updated bio content",
  "profession": "Senior Software Engineer",
  "organization": "New Tech Company",
  "organizationWebsite": "https://newtechcompany.com",
  "jobTitle": "Lead Developer",
  "city": "Dhaka",
  "country": "Bangladesh",
  "permanentAddress": "456 New Street, Dhaka",
  "sameAsCurrentAddress": false,
  "countryCode": "+880",
  "phoneNumber": "9876543210",
  "showPhone": true,
  "dateOfBirth": "1995-05-15",
  "expertise": ["React", "Node.js", "TypeScript", "GraphQL"],
  "socialLinks": {
    "facebook": "https://facebook.com/johndoe",
    "linkedin": "https://linkedin.com/in/johndoe",
    "youtube": "https://youtube.com/@johndoe",
    "twitter": "https://twitter.com/johndoe",
    "instagram": "https://instagram.com/johndoe",
    "website": "https://johndoe.dev"
  },
  "willingToMentor": true,
  "mentorshipAreas": ["Web Development", "Career Guidance", "Startups"],
  "aboutMe": "More detailed information about myself...",
  "hallOfFameOptIn": true,
  "hallOfFameBio": "Updated hall of fame bio",
  "education": [
    {
      "id": "edu1",
      "degree": "SSC",
      "institution": "Cantonment Public School and College",
      "graduationYear": "2015",
      "department": "Science",
      "isDefault": true
    },
    {
      "id": "edu2",
      "degree": "BSc Computer Science",
      "institution": "University of Dhaka",
      "graduationYear": "2019",
      "department": "Computer Science",
      "isDefault": false
    }
  ],
  "workExperience": [
    {
      "id": "work1",
      "title": "Senior Software Engineer",
      "company": "Tech Company Ltd",
      "startDate": "2020-01-15",
      "endDate": "2023-01-15",
      "isCurrent": false,
      "description": "Led frontend development team..."
    },
    {
      "id": "work2",
      "title": "Lead Developer",
      "company": "New Tech Company",
      "startDate": "2023-02-01",
      "endDate": "",
      "isCurrent": true,
      "description": "Leading full-stack development..."
    }
  ]
}
```

#### Response Format:
```json
{
  "user": {
    // Complete updated user object (same format as login)
  },
  "message": "Profile updated successfully"
}
```

### 3. Upload Profile Picture

**Function:** `UserService.uploadProfilePicture()`  
**Location:** `src/services/userService.ts`  
**API Endpoint:** `POST /alumni/{id}/profile-picture`

#### Request Format:
FormData with file:
- `profile_picture`: File object

#### Response Format:
```json
{
  "profilePicture": "/storage/profile_pictures/user1_updated.jpg",
  "message": "Profile picture uploaded successfully"
}
```

### 4. Delete Profile Picture

**Function:** `UserService.deleteProfilePicture()`  
**Location:** `src/services/userService.ts`  
**API Endpoint:** `DELETE /alumni/{id}/profile-picture`

#### Request Format:
Headers only (Authorization: Bearer token)

#### Response Format:
```json
{
  "message": "Profile picture deleted successfully"
}
```

### 5. Get Profile Completion Status

**Function:** `UserService.getProfileCompletionStatus()`  
**Location:** `src/services/userService.ts`  
**API Endpoint:** `GET /alumni/{id}/completion-status`

#### Request Format:
Headers only (Authorization: Bearer token)

#### Response Format:
```json
{
  "profileCompletionScore": 85,
  "missingFields": ["dateOfBirth"],
  "completedSections": {
    "basicInfo": true,
    "contactInfo": true,
    "professionalInfo": true,
    "socialLinks": true,
    "mentorship": true
  }
}
```

---

## Data Type Definitions

### UserProfile Type (Frontend expects from backend):
```typescript
{
  profilePicture?: string;           // URL to profile image
  bio?: string;                     // HTML content for bio
  profession?: string;              // e.g., "Software Engineer"
  organization?: string;            // Company/org name
  organizationWebsite?: string;     // Company website URL
  jobTitle?: string;               // Current job title
  city?: string;                   // Current city
  country?: string;                // Current country
  permanentAddress?: string;       // Full permanent address
  sameAsCurrentAddress?: boolean;  // If permanent = current
  countryCode?: string;           // e.g., "+880"
  phoneNumber?: string;           // Phone without country code
  showPhone?: boolean;            // Privacy setting
  dateOfBirth?: string;          // ISO date string "YYYY-MM-DD"
  expertise?: string[];          // Array of skill strings
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  willingToMentor?: boolean;
  mentorshipAreas?: string[];     // Array of mentorship topics
  aboutMe?: string;              // HTML content
  hallOfFameOptIn?: boolean;
  hallOfFameBio?: string;        // HTML content
  education?: EducationEntry[];
  workExperience?: WorkExperience[];
  profileCompletionScore?: number; // 0-100
}
```

### EducationEntry Type:
```typescript
{
  id: string;                    // Unique identifier
  degree: string;               // e.g., "SSC", "BSc Computer Science"
  institution: string;          // School/university name
  graduationYear: string;       // Year as string
  department?: string;          // e.g., "Computer Science"
  isDefault?: boolean;         // If it's the default CPSCS entry
}
```

### WorkExperience Type:
```typescript
{
  id: string;                  // Unique identifier
  title: string;              // Job title
  company: string;            // Company name
  startDate: string;          // ISO date string
  endDate?: string;           // ISO date string or empty if current
  isCurrent: boolean;         // If this is current job
  description?: string;       // Job description
}
```

### User Type (Complete user object):
```typescript
{
  id: string;
  fullName: string;
  email: string;
  sscYear: string;
  hscYear?: string;
  attendanceFromYear?: string;
  attendanceToYear?: string;
  profilePhoto?: string;        // URL to profile image
  isAuthenticated: boolean;
  isAdmin?: boolean;
  isDemoUser?: boolean;
  hasMembership: boolean;
  dateJoined?: string;         // ISO date string
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  countryCode?: string;        // e.g., "+880"
  phoneNumber?: string;        // Phone without country code
  socialProfileLink?: string;  // Legacy field from signup
  profile?: UserProfile;       // Complete profile object
}
```

---

## API Function Reference

### AuthService Functions

| Function | Class | API Endpoint | Request Format | Response Format |
|----------|-------|--------------|----------------|-----------------|
| `login()` | AuthService | `POST /alumni/login` | `{email, password}` | `{user, token, message}` |
| `register()` | AuthService | `POST /alumni/register` | snake_case fields | `{user, token, message}` |
| `logout()` | AuthService | `POST /alumni/logout` | Headers only | `{message}` |
| `refreshToken()` | AuthService | `POST /alumni/refresh` | Headers only | `{token, message}` |
| `getCurrentUserFromAPI()` | AuthService | `GET /alumni/me` | Headers only | `{user}` |
| `forgotPassword()` | AuthService | `POST /alumni/forgot-password` | `{email}` | `{message}` |
| `resetPassword()` | AuthService | `POST /alumni/reset-password` | `{email, token, password, passwordConfirmation}` | `{message}` |

### UserService Functions

| Function | Class | API Endpoint | Request Format | Response Format |
|----------|-------|--------------|----------------|-----------------|
| `getUserProfile()` | UserService | `GET /alumni/{id}` | URL param + headers | `{user}` |
| `updateProfile()` | UserService | `PUT /alumni/{id}/profile` | camelCase profile data | `{user, message}` |
| `getProfileCompletionStatus()` | UserService | `GET /alumni/{id}/completion-status` | Headers only | `{profileCompletionScore, missingFields, completedSections}` |
| `uploadProfilePicture()` | UserService | `POST /alumni/{id}/profile-picture` | FormData with file | `{profilePicture, message}` |
| `deleteProfilePicture()` | UserService | `DELETE /alumni/{id}/profile-picture` | Headers only | `{message}` |

---

## Important Notes

1. **Case Conversion**: Registration sends snake_case to backend, but expects camelCase in responses
2. **Date Format**: All dates should be ISO strings ("YYYY-MM-DD" for dateOfBirth, full ISO for dateJoined)
3. **Phone Numbers**: countryCode and phoneNumber are separate fields
4. **HTML Content**: bio, aboutMe, hallOfFameBio can contain HTML
5. **Arrays**: expertise and mentorshipAreas are arrays of strings
6. **Social Links**: All social link URLs should be complete URLs
7. **Profile Pictures**: Should return full URLs accessible by frontend
8. **Token**: JWT token should be included in Authorization header as "Bearer {token}"
9. **Missing Fields**: Backend should handle optional fields gracefully (null/undefined)
10. **Profile Completion**: Score is calculated based on 10 key fields (0-100 percentage)

This documentation ensures perfect compatibility between the React frontend and Laravel backend API.
