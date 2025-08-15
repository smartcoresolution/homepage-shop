// 개선된 오프라인 캐시 전략
const CACHE_NAME = 'scs-cache-v2';
const STATIC_ASSETS = [
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// 설치 시 정적 자산 캐시
self.addEventListener('install', (event) => {
  console.log('서비스워커 설치 중...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('캐시에 정적 자산 추가 중...');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch(error => {
        console.error('캐시 추가 실패:', error);
      })
  );
});

// 활성화 시 이전 캐시 정리
self.addEventListener('activate', (event) => {
  console.log('서비스워커 활성화 중...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => {
              console.log('이전 캐시 삭제:', name);
              return caches.delete(name);
            })
        );
      })
      .catch(error => {
        console.error('캐시 정리 실패:', error);
      })
  );
});

// 네트워크 우선, 캐시 폴백 전략
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Firebase Storage 요청은 네트워크 전용 (캐시하지 않음)
  if (request.url.includes('firebasestorage.googleapis.com')) {
    console.log('Firebase Storage 요청 감지:', request.url);
    
    // CORS 헤더 추가
    const modifiedRequest = new Request(request, {
      mode: 'cors',
      credentials: 'omit'
    });
    
    event.respondWith(
      fetch(modifiedRequest)
        .then(response => {
          console.log('Firebase Storage 응답 성공:', response.status);
          return response;
        })
        .catch(error => {
          console.error('Firebase Storage 요청 실패:', error);
          
          // 상세한 오류 정보 로깅
          if (error.name === 'TypeError' && error.message.includes('CORS')) {
            console.error('CORS 정책 위반 감지');
          }
          
          // Firebase Storage 요청 실패 시 에러 응답 반환
          return new Response(JSON.stringify({ 
            error: 'Storage request failed',
            details: error.message,
            timestamp: new Date().toISOString()
          }), {
            status: 500,
            statusText: 'Internal Server Error',
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        })
    );
    return;
  }
  
  // 정적 자산은 캐시 우선
  if (STATIC_ASSETS.includes(request.url)) {
    event.respondWith(
      caches.match(request)
        .then(response => response || fetch(request))
        .catch(() => {
          console.log('정적 자산 캐시 폴백:', request.url);
          return caches.match(request);
        })
    );
    return;
  }
  
  // 동적 콘텐츠는 네트워크 우선
  event.respondWith(
    fetch(request)
      .then(response => {
        // 성공한 응답을 캐시에 저장 (선택적)
        if (response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // 네트워크 실패 시 캐시에서 찾기
        return caches.match(request);
      })
  );
});
