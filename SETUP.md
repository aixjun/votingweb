# 투표 시스템 설정 가이드

## 1. Supabase 프로젝트 생성

### 1.1 계정 생성 및 프로젝트 만들기
1. [Supabase](https://supabase.com) 접속
2. GitHub 계정으로 로그인
3. "New Project" 클릭
4. 프로젝트 정보 입력:
   - Name: `votingweb` (원하는 이름)
   - Database Password: 안전한 비밀번호 설정 (기록해두세요)
   - Region: Northeast Asia (Seoul) 선택
5. "Create new project" 클릭 (2-3분 소요)

### 1.2 테이블 생성
1. 좌측 메뉴에서 **SQL Editor** 클릭
2. **New Query** 클릭
3. `supabase-schema.sql` 파일 내용 전체 복사하여 붙여넣기
4. **Run** 버튼 클릭
5. 성공 메시지 확인

### 1.3 API 키 확인
1. 좌측 메뉴에서 **Settings** → **API** 클릭
2. 다음 두 값을 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** 키: `eyJhbGci...` (긴 문자열)

### 1.4 프로젝트에 API 키 설정
`js/supabase-config.js` 파일 수정:
```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co';  // Project URL
const SUPABASE_ANON_KEY = 'eyJhbGci...';  // anon public 키
```

### 1.5 관리자 계정 추가
1. Supabase 대시보드에서 **Table Editor** 클릭
2. `admins` 테이블 선택
3. **Insert row** 클릭
4. 정보 입력:
   - employee_id: 관리자 사번
   - password: 관리자 비밀번호
5. **Save** 클릭

---

## 2. GitHub 저장소 설정

### 2.1 코드 업로드
```bash
cd /home/adjh/voteweb
git init
git add .
git commit -m "Initial commit: 투표 시스템"
git branch -M main
git remote add origin https://github.com/aixjun/votingweb.git
git push -u origin main
```

### 2.2 GitHub Pages 활성화
1. GitHub 저장소 페이지 접속
2. **Settings** 탭 클릭
3. 좌측 메뉴에서 **Pages** 클릭
4. Source 섹션에서:
   - **Source**: GitHub Actions 선택
5. 자동으로 배포가 시작됩니다

### 2.3 배포 확인
- Actions 탭에서 배포 진행 상황 확인
- 완료 후 `https://aixjun.github.io/votingweb` 접속

---

## 3. 엑셀 파일 형식

### 참여자(청중) 엑셀
| 사번 | 이름 | 부서 | 비밀번호 |
|------|------|------|----------|
| 1001 | 홍길동 | 개발팀 | pass1234 |
| 1002 | 김철수 | 기획팀 | pass5678 |

### 발표자(팀) 엑셀
| 팀명 | 발표자 | 주제 | 순서 |
|------|--------|------|------|
| AI혁신팀 | 이영희 | AI 자동화 | 1 |
| 데이터팀 | 박민수 | 데이터 분석 | 2 |

---

## 4. 사용 방법

### 관리자
1. 관리자 사번/비밀번호로 로그인
2. 참여자 엑셀 업로드
3. 발표자 엑셀 업로드
4. 투표 설정 (최대 투표 수, 투표 활성화)
5. 실시간 집계 확인

### 참여자
1. 사번/비밀번호로 로그인
2. 발표자 목록에서 선택
3. 투표 제출

---

## 5. 문제 해결

### "사번 또는 비밀번호가 올바르지 않습니다"
- Supabase에 참여자/관리자 데이터가 있는지 확인
- 엑셀 업로드가 정상적으로 되었는지 확인

### 데이터가 저장되지 않음
- Supabase API 키가 올바른지 확인
- RLS 정책이 적용되었는지 확인

### GitHub Pages 배포 실패
- Actions 탭에서 에러 로그 확인
- Repository Settings > Pages에서 Source가 "GitHub Actions"인지 확인
