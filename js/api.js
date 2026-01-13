// API 함수 모음

// ==================== 참여자 관련 ====================

// 참여자 로그인
async function loginParticipant(employeeId, password) {
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .eq('employee_id', employeeId)
    .eq('password', password)
    .single();

  if (error || !data) {
    throw new Error('사번 또는 비밀번호가 올바르지 않습니다.');
  }

  return data;
}

// 관리자 로그인
async function loginAdmin(employeeId, password) {
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('employee_id', employeeId)
    .eq('password', password)
    .single();

  if (error || !data) {
    throw new Error('관리자 정보가 올바르지 않습니다.');
  }

  return data;
}

// 참여자 목록 조회
async function getParticipants() {
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

// 참여자 일괄 등록
async function upsertParticipants(participants) {
  const { data, error } = await supabase
    .from('participants')
    .upsert(participants, { onConflict: 'employee_id' });

  if (error) throw error;
  return data;
}

// 참여자 전체 삭제
async function deleteAllParticipants() {
  const { error } = await supabase
    .from('participants')
    .delete()
    .neq('id', 0); // 전체 삭제

  if (error) throw error;
}

// ==================== 발표자 관련 ====================

// 발표자 목록 조회
async function getPresenters() {
  const { data, error } = await supabase
    .from('presenters')
    .select('*')
    .order('display_order');

  if (error) throw error;
  return data || [];
}

// 발표자 일괄 등록
async function upsertPresenters(presenters) {
  const { data, error } = await supabase
    .from('presenters')
    .upsert(presenters, { onConflict: 'team_name' });

  if (error) throw error;
  return data;
}

// 발표자 전체 삭제
async function deleteAllPresenters() {
  const { error } = await supabase
    .from('presenters')
    .delete()
    .neq('id', 0);

  if (error) throw error;
}

// ==================== 투표 관련 ====================

// 투표하기
async function submitVotes(participantId, presenterIds) {
  // 기존 투표 삭제
  await supabase
    .from('votes')
    .delete()
    .eq('participant_id', participantId);

  // 새 투표 등록
  const votes = presenterIds.map(presenterId => ({
    participant_id: participantId,
    presenter_id: presenterId
  }));

  const { data, error } = await supabase
    .from('votes')
    .insert(votes);

  if (error) throw error;
  return data;
}

// 내 투표 조회
async function getMyVotes(participantId) {
  const { data, error } = await supabase
    .from('votes')
    .select('presenter_id')
    .eq('participant_id', participantId);

  if (error) throw error;
  return data ? data.map(v => v.presenter_id) : [];
}

// 투표 여부 확인
async function hasVoted(participantId) {
  const { data, error } = await supabase
    .from('votes')
    .select('id')
    .eq('participant_id', participantId)
    .limit(1);

  if (error) throw error;
  return data && data.length > 0;
}

// 투표 집계 조회
async function getVoteResults() {
  const { data, error } = await supabase
    .from('votes')
    .select(`
      presenter_id,
      presenters (
        id,
        team_name,
        presenter_name,
        topic
      )
    `);

  if (error) throw error;

  // 집계
  const results = {};
  data.forEach(vote => {
    const pid = vote.presenter_id;
    if (!results[pid]) {
      results[pid] = {
        ...vote.presenters,
        count: 0
      };
    }
    results[pid].count++;
  });

  return Object.values(results).sort((a, b) => b.count - a.count);
}

// 투표 전체 삭제
async function deleteAllVotes() {
  const { error } = await supabase
    .from('votes')
    .delete()
    .neq('id', 0);

  if (error) throw error;
}

// 투표 참여자 수
async function getVoteParticipantCount() {
  const { data, error } = await supabase
    .from('votes')
    .select('participant_id');

  if (error) throw error;

  const uniqueParticipants = new Set(data.map(v => v.participant_id));
  return uniqueParticipants.size;
}

// ==================== 설정 관련 ====================

// 설정 조회
async function getSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || { max_votes: 5, voting_open: true };
}

// 설정 업데이트
async function updateSettings(settings) {
  const { data, error } = await supabase
    .from('settings')
    .upsert({ id: 1, ...settings });

  if (error) throw error;
  return data;
}
