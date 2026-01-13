// Supabase 설정
// 아래 값들을 실제 Supabase 프로젝트 정보로 교체하세요
const SUPABASE_URL = 'https://mrzujtreksaeljyixrbk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yenVqdHJla3NhZWxqeWl4cmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNTM5NzEsImV4cCI6MjA4MzgyOTk3MX0.UJxpO8w3N6ALgH43PgNRUyaMcISWZbEwJCEN_ed4npY';

// Supabase 클라이언트 초기화
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 세션 관리
const Session = {
  set(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  remove(key) {
    sessionStorage.removeItem(key);
  },
  clear() {
    sessionStorage.clear();
  }
};

// 현재 로그인한 사용자 정보
function getCurrentUser() {
  return Session.get('currentUser');
}

// 로그인 상태 확인
function isLoggedIn() {
  return getCurrentUser() !== null;
}

// 관리자 여부 확인
function isAdmin() {
  const user = getCurrentUser();
  return user && user.isAdmin === true;
}

// 로그아웃
function logout() {
  Session.clear();
  window.location.href = 'index.html';
}
