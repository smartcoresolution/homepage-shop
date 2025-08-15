// ===== 공지사항 관리 시스템 =====

// 전역 변수
let announcements = [];
let currentAnnouncementId = 1;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadAnnouncements();
    setupFormHandlers();
});

// ===== 폼 핸들러 설정 =====
function setupFormHandlers() {
    const form = document.getElementById('announcementForm');
    if (form) {
        form.addEventListener('submit', handleAnnouncementSubmit);
    }
}

// ===== 공지사항 제출 처리 =====
function handleAnnouncementSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const title = formData.get('title').trim();
    const content = formData.get('content').trim();
    const priority = formData.get('priority');
    const tags = formData.get('tags').trim();
    const files = formData.getAll('files');
    
    // 유효성 검사
    if (!title || !content) {
        alert('제목과 내용을 모두 입력해주세요.');
        return;
    }
    
    // 파일 크기 및 개수 검사
    if (files.length > 5) {
        alert('첨부파일은 최대 5개까지 업로드할 수 있습니다.');
        return;
    }
    
    for (let file of files) {
        if (file.size > 10 * 1024 * 1024) { // 10MB
            alert(`파일 "${file.name}"이 10MB를 초과합니다.`);
            return;
        }
    }
    
    // 공지사항 생성
    const announcement = {
        id: currentAnnouncementId++,
        title: title,
        content: content,
        priority: priority,
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        files: Array.from(files).map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // 공지사항 추가
    announcements.unshift(announcement);
    
    // 로컬 스토리지에 저장
    saveAnnouncements();
    
    // 목록 새로고침
    loadAnnouncements();
    
    // 폼 초기화
    resetForm();
    
    // 성공 메시지
    alert('공지사항이 성공적으로 등록되었습니다.');
}

// ===== 폼 초기화 =====
function resetForm() {
    const form = document.getElementById('announcementForm');
    if (form) {
        form.reset();
    }
}

// ===== 공지사항 로드 =====
function loadAnnouncements() {
    // 로컬 스토리지에서 로드
    const saved = localStorage.getItem('announcements');
    if (saved) {
        announcements = JSON.parse(saved);
        if (announcements.length > 0) {
            currentAnnouncementId = Math.max(...announcements.map(a => a.id)) + 1;
        }
    }
    
    displayAnnouncements();
}

// ===== 공지사항 표시 =====
function displayAnnouncements() {
    const container = document.getElementById('announcementsList');
    if (!container) return;
    
    if (announcements.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 40px;">등록된 공지사항이 없습니다.</p>';
        return;
    }
    
    container.innerHTML = announcements.map(announcement => `
        <div class="admin-announcement-item" onclick="showAnnouncementModal(${announcement.id})">
            <div class="admin-announcement-header">
                <h3 class="admin-announcement-title">${escapeHtml(announcement.title)}</h3>
                <div class="admin-announcement-meta">
                    <span class="admin-announcement-priority ${announcement.priority}">
                        ${getPriorityText(announcement.priority)}
                    </span>
                    <span class="admin-announcement-date">
                        ${formatDate(announcement.createdAt)}
                    </span>
                </div>
            </div>
            <div class="admin-announcement-content">
                ${escapeHtml(announcement.content.substring(0, 150))}${announcement.content.length > 150 ? '...' : ''}
            </div>
            ${announcement.files.length > 0 ? `
                <div class="admin-announcement-files">
                    ${announcement.files.map(file => `
                        <span class="admin-announcement-file">
                            <span class="admin-announcement-file-icon">📎</span>
                            ${escapeHtml(file.name)}
                        </span>
                    `).join('')}
                </div>
            ` : ''}
            ${announcement.tags.length > 0 ? `
                <div class="admin-announcement-tags">
                    ${announcement.tags.map(tag => `
                        <span class="admin-announcement-tag">${escapeHtml(tag)}</span>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// ===== 공지사항 모달 표시 =====
function showAnnouncementModal(id) {
    const announcement = announcements.find(a => a.id === id);
    if (!announcement) return;
    
    const modal = document.getElementById('announcementModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const modalFiles = document.getElementById('modalFiles');
    const modalTags = document.getElementById('modalTags');
    
    if (modal && modalTitle && modalContent && modalFiles && modalTags) {
        modalTitle.textContent = announcement.title;
        modalContent.innerHTML = `<p>${announcement.content.replace(/\n/g, '</p><p>')}</p>`;
        
        // 파일 목록
        if (announcement.files.length > 0) {
            modalFiles.innerHTML = `
                <h4>첨부파일 (${announcement.files.length}개)</h4>
                <div class="modal-file-list">
                    ${announcement.files.map(file => `
                        <a href="#" class="modal-file-item" onclick="downloadFile('${escapeHtml(file.name)}', ${file.size})">
                            <span class="modal-file-icon">📎</span>
                            ${escapeHtml(file.name)} (${formatFileSize(file.size)})
                        </a>
                    `).join('')}
                </div>
            `;
        } else {
            modalFiles.innerHTML = '';
        }
        
        // 태그 목록
        if (announcement.tags.length > 0) {
            modalTags.innerHTML = `
                <h4>태그</h4>
                <div class="modal-tag-list">
                    ${announcement.tags.map(tag => `
                        <span class="modal-tag">${escapeHtml(tag)}</span>
                    `).join('')}
                </div>
            `;
        } else {
            modalTags.innerHTML = '';
        }
        
        modal.style.display = 'block';
    }
}

// ===== 모달 닫기 =====
function closeModal() {
    const modal = document.getElementById('announcementModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ===== 파일 다운로드 시뮬레이션 =====
function downloadFile(filename, size) {
    alert(`파일 "${filename}" 다운로드가 시작됩니다.\n\n실제 구현에서는 서버에서 파일을 제공합니다.`);
}

// ===== 유틸리티 함수 =====

// HTML 이스케이프
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 우선순위 텍스트 변환
function getPriorityText(priority) {
    const priorityMap = {
        'normal': '일반',
        'high': '중요',
        'urgent': '긴급'
    };
    return priorityMap[priority] || '일반';
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

// 파일 크기 포맷팅
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 공지사항 저장
function saveAnnouncements() {
    localStorage.setItem('announcements', JSON.stringify(announcements));
}

// ===== 이벤트 리스너 =====

// 모달 외부 클릭 시 닫기
window.addEventListener('click', function(event) {
    const modal = document.getElementById('announcementModal');
    if (event.target === modal) {
        closeModal();
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// ===== 공지사항 삭제 기능 =====
function deleteAnnouncement(id) {
    if (confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
        announcements = announcements.filter(a => a.id !== id);
        saveAnnouncements();
        loadAnnouncements();
        alert('공지사항이 삭제되었습니다.');
    }
}

// ===== 공지사항 수정 기능 =====
function editAnnouncement(id) {
    const announcement = announcements.find(a => a.id === id);
    if (!announcement) return;
    
    // 폼에 데이터 채우기
    document.getElementById('title').value = announcement.title;
    document.getElementById('content').value = announcement.content;
    document.getElementById('priority').value = announcement.priority;
    document.getElementById('tags').value = announcement.tags.join(', ');
    
    // 기존 공지사항 삭제
    deleteAnnouncement(id);
    
    // 페이지 상단으로 스크롤
    document.querySelector('.admin-form-container').scrollIntoView({ behavior: 'smooth' });
}


