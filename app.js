// PWA 설치 이벤트 처리 (개선된 버전)
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById('installBtn');
  if (btn) {
    btn.style.display = 'inline-block';
    btn.disabled = false;
  }
});

window.installPWA = async function() {
  if (!deferredPrompt) {
    console.log('PWA 설치 프롬프트를 사용할 수 없습니다.');
    return;
  }
  
  try {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('PWA 설치 결과:', outcome);
    
    if (outcome === 'accepted') {
      console.log('PWA가 성공적으로 설치되었습니다.');
    }
  } catch (error) {
    console.error('PWA 설치 중 오류 발생:', error);
  } finally {
    deferredPrompt = null;
    const btn = document.getElementById('installBtn');
    if (btn) {
      btn.style.display = 'none';
      btn.disabled = true;
    }
  }
};

// 서비스워커 등록 (개선된 에러 처리)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('서비스워커 등록 성공:', registration.scope);
      })
      .catch(error => {
        console.error('서비스워커 등록 실패:', error);
      });
  });
}


// ===== 서비스 드롭다운: 모바일/태블릿 클릭 토글 + 바깥 클릭 닫기 =====
(function(){
  const dd = document.getElementById('svcDropdown');
  if (!dd) return;
  const btn = dd.querySelector('.dropbtn');
  const panel = dd.querySelector('.dropdown-content');

  btn.setAttribute('aria-expanded', 'false');

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = dd.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  dd.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dd.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (!dd.contains(e.target)) {
      dd.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

// ===== 공지사항 관리 기능 =====
function showAllAnnouncements() {
  // 전체 공지사항 페이지로 이동하거나 모달 표시
  alert('전체 공지사항 페이지가 준비 중입니다. 곧 서비스될 예정입니다.');
  
  // 향후 구현 예정:
  // 1. 모달 창으로 전체 공지사항 표시
  // 2. 별도 공지사항 페이지로 이동
  // 3. 공지사항 검색 및 필터링 기능
}

// 공지사항 새로고침
async function refreshAnnouncements() {
  try {
    // index.html의 loadAnnouncements 함수 호출
    if (typeof loadAnnouncements === 'function') {
      await loadAnnouncements();
      console.log('공지사항이 새로고침되었습니다.');
    } else {
      console.log('loadAnnouncements 함수를 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('공지사항 새로고침 실패:', error);
  }
}

// 페이지 로드 시 공지사항 초기화
document.addEventListener('DOMContentLoaded', function() {
  // 공지사항 카운터 표시 (선택사항)
  const announcementCards = document.querySelectorAll('.announcement-card');
  if (announcementCards.length > 0) {
    console.log(`총 ${announcementCards.length}개의 공지사항이 표시됩니다.`);
  }
});
