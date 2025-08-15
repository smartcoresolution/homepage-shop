# SmartCoreSolution Homepage

스마트코어솔루션의 공식 홈페이지입니다. AI 기반 헬스케어 및 스마트제조 솔루션을 제공하는 회사의 웹사이트로, 공지사항 관리, 문의하기, 서비스 소개 등의 기능을 포함합니다.

## 🚀 주요 기능

### 📢 공지사항 관리 시스템
- **관리자 페이지**: 공지사항 등록, 수정, 삭제 기능
- **파일 첨부**: 최대 500KB 파일 업로드 지원 (Base64 인코딩)
- **실시간 표시**: 메인 페이지에 최신 공지사항 자동 표시
- **모달 팝업**: 제목 클릭 시 전체 내용 및 첨부파일 다운로드
- **최신순 정렬**: 등록일 기준 내림차순 정렬
- **표시 제한**: 최대 6개 공지사항 표시, "더 보기" 기능

### 📧 문의하기 시스템
- **AJAX 폼 제출**: SPA 안전한 비동기 전송
- **FormSubmit 연동**: 무료 폼 처리 서비스
- **대안 전송**: 서비스 장애 시 이메일 앱 자동 실행
- **모바일 최적화**: 터치 친화적 UI 및 iOS 호환성
- **실시간 검증**: 클라이언트 사이드 폼 검증

### 🏥 헬스케어 서비스
- **정신 건강·인지 기능 진단**: AI 기반 진단 솔루션
- **의료 기록 자동화**: EMR 시스템 최적화
- **재활 치료·의료 통역**: 다국어 의료 서비스

### 🏭 스마트제조 솔루션
- **제조 공정 최적화**: AI 기반 생산성 향상
- **품질 관리**: 실시간 모니터링 및 예측 분석
- **자동화 시스템**: IoT 및 센서 기반 스마트 팩토리

### 📱 PWA (Progressive Web App)
- **오프라인 지원**: 서비스 워커를 통한 캐싱
- **앱 설치**: 모바일에서 홈 화면에 추가 가능
- **반응형 디자인**: 모든 디바이스에서 최적화된 경험

## 🛠 기술 스택

### Frontend
- **HTML5**: 시맨틱 마크업 및 최신 웹 표준
- **CSS3**: Flexbox, Grid, CSS 변수, 미디어 쿼리
- **JavaScript (ES6+)**: Async/Await, Fetch API, DOM 조작
- **PWA**: Service Worker, Web App Manifest

### Backend & Database
- **Firebase Firestore**: NoSQL 데이터베이스
- **Firebase Hosting**: 정적 웹사이트 호스팅
- **FormSubmit.co**: 무료 폼 처리 서비스

### 파일 처리
- **Base64 인코딩**: 파일 데이터 직접 저장
- **Blob API**: 파일 다운로드 처리
- **Drag & Drop**: 파일 업로드 사용자 경험 향상

## 📁 프로젝트 구조

```
homepage-main/
├── 📄 index.html                 # 메인 홈페이지 (공지사항 표시)
├── 📄 admin-announcements.html   # 공지사항 관리자 페이지
├── 📄 contact.html               # 문의하기 페이지
├── 📄 healthcare.html            # 헬스케어 서비스 소개
├── 📄 manufacturing.html         # 스마트제조 서비스 소개
├── 📄 thank_you.html            # 문의 완료 감사 페이지
├── 📄 app.js                     # 공통 JavaScript (PWA, 새로고침)
├── 📄 styles.css                 # 전역 스타일시트
├── 📄 service-worker.js          # PWA 서비스 워커
├── 📄 manifest.webmanifest       # PWA 매니페스트
├── 📁 assets/                    # 이미지 및 아이콘
│   ├── icons/                    # SVG 아이콘들
│   └── *.png, *.webp            # 서비스 이미지들
├── 📁 images/                    # 추가 이미지 리소스
└── 📁 icons/                     # PWA 아이콘들
```

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone [repository-url]
cd homepage-main
```

### 2. 로컬 서버 실행
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# Live Server (VS Code 확장)
# index.html 우클릭 → "Open with Live Server"
```

### 3. 브라우저에서 접속
```
http://localhost:8000
```

## ⚙️ 설정

### Firebase 설정
1. **Firebase 프로젝트 생성**
2. **Firestore Database 활성화**
3. **웹 앱 추가 및 설정**
4. **config 객체를 `admin-announcements.html`에 추가**

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### FormSubmit 설정
1. **FormSubmit.co 접속**
2. **이메일 주소 입력**: `jangck11@smartcoresolution.com`
3. **활성화 이메일 확인**
4. **"Activate your form" 링크 클릭**

## 📱 모바일 최적화

### 반응형 디자인
- **모바일 우선 접근법**: 768px 이하 최적화
- **터치 타겟**: 최소 44px 터치 영역
- **iOS 호환성**: 줌 방지 및 안전 영역 지원

### PWA 기능
- **오프라인 지원**: 서비스 워커 캐싱
- **앱 설치**: 홈 화면 추가 지원
- **푸시 알림**: 향후 구현 예정

## 🔧 주요 기능 상세

### 공지사항 시스템
```javascript
// Firebase에서 공지사항 로드
async function loadAnnouncements() {
  const querySnapshot = await getDocs(collection(db, "announcements"));
  const announcements = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  // 최신순 정렬 및 6개 제한
  return announcements
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 6);
}
```

### 파일 업로드 시스템
```javascript
// Base64 인코딩으로 파일 저장
async function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.readAsDataURL(file);
  });
}
```

### 문의하기 시스템
```javascript
// FormSubmit 실패 시 대안 방법
if (responseText.includes('activation')) {
  const mailtoLink = `mailto:jangck11@smartcoresolution.com?subject=${emailSubject}&body=${emailBody}`;
  window.location.href = mailtoLink;
}
```

## 🐛 문제 해결

### 일반적인 문제들

#### 1. Firebase 연결 오류
- **증상**: "Firebase is not defined" 오류
- **해결**: Firebase SDK 스크립트가 올바르게 로드되었는지 확인

#### 2. 파일 업로드 실패
- **증상**: 파일이 저장되지 않음
- **해결**: 파일 크기 제한(500KB) 확인, Base64 변환 로그 확인

#### 3. FormSubmit 활성화 필요
- **증상**: "This form needs activation" 메시지
- **해결**: 이메일로 전송된 활성화 링크 클릭

#### 4. 모바일에서 문의 전송 실패
- **증상**: "전송상태를 확인하지 못했습니다" 메시지
- **해결**: 대안 전송 시스템이 자동으로 이메일 앱 실행

## 📈 성능 최적화

### 이미지 최적화
- **WebP 포맷**: 최신 브라우저 지원
- **PNG 폴백**: 구형 브라우저 호환성
- **적응형 이미지**: 디바이스별 최적 크기

### 코드 최적화
- **비동기 로딩**: Firebase SDK 비동기 초기화
- **지연 로딩**: 필요 시에만 리소스 로드
- **캐싱 전략**: 서비스 워커를 통한 정적 리소스 캐싱

## 🔒 보안 고려사항

### 클라이언트 사이드 보안
- **입력 검증**: HTML5 및 JavaScript 폼 검증
- **XSS 방지**: 사용자 입력 데이터 이스케이프
- **CSRF 보호**: FormSubmit 서비스의 내장 보안

### 데이터 보안
- **Firebase 보안 규칙**: Firestore 접근 제어
- **파일 크기 제한**: 업로드 파일 크기 제한
- **파일 타입 검증**: 허용된 파일 형식만 업로드

## 🚀 배포

### GitHub Pages
1. **저장소 설정** → Pages
2. **Source**: Deploy from a branch
3. **Branch**: main, folder: / (root)
4. **자동 배포**: main 브랜치 푸시 시 자동 배포

### Firebase Hosting
```bash
# Firebase CLI 설치
npm install -g firebase-tools

# 로그인 및 프로젝트 선택
firebase login
firebase use your-project-id

# 배포
firebase deploy
```

## 🤝 기여하기

### 개발 환경 설정
1. **코드 포크**
2. **기능 브랜치 생성**
3. **변경사항 커밋**
4. **Pull Request 생성**

### 코딩 스타일
- **HTML**: 시맨틱 마크업, 접근성 고려
- **CSS**: BEM 방법론, CSS 변수 활용
- **JavaScript**: ES6+ 문법, async/await 사용

## 📞 지원 및 문의

### 기술 지원
- **이메일**: jangck11@smartcoresolution.com
- **문의 페이지**: `/contact.html`

### 버그 리포트
- **GitHub Issues**: 프로젝트 저장소에 이슈 등록
- **상세 정보**: 오류 메시지, 브라우저 정보, 단계별 재현 방법

## 📄 라이선스

이 프로젝트는 SmartCoreSolution, Inc.의 소유입니다.

---

**© 2025 SmartCoreSolution, Inc. All rights reserved.**

