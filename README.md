# 모바일 청첩장

2027년 5월 9일 오전 11시 · 서울 아벤티움. 이름과 사진은 미정인 청첩장 시안입니다. 주소·교통·주차 위치는 공식 안내를 반영했습니다.

## 실행

Node 22.23.4 이상에서 `npm.cmd ci`, `npm.cmd run dev`를 실행하고 http://127.0.0.1:4325 에 접속합니다.
이 컴퓨터에서는 `start-local.cmd`를 실행하면 설치된 Codex의 Node 런타임을 우선 사용합니다. 시스템 기본 Node 설정은 바꾸지 않습니다.
빌드: `npm.cmd run build`. 출력 폴더: `dist`.

## 수정할 곳

- `src/data/wedding.ts`: 이름, 예식일시, 장소, 인사말, 사진, 교통, 연락처, 계좌.
- `public/photos/`: 사용할 사진을 넣고 `/photos/파일명.jpg`로 참조.
- `src/styles/global.css`: 색상, 글꼴, 여백.
- `src/pages/index.astro`: 화면 구성 및 기본 상호작용.

미입력 연락처와 계좌는 숨깁니다. 지도는 도로명 주소로 검색하며, 별관 주차장 링크는 서소문공원 주차장으로 별도 연결합니다. 참고 사이트의 사진·문구·개인정보는 복사하지 않았습니다. 초대 문구는 수정 가능한 초안입니다.

## 작업과 배포

`work/invitation`에서 수정하고 커밋·push해 백업합니다. 검토한 변경만 main으로 합칩니다.
GitHub Pages: https://ygjangontact.github.io/wedding-invitation/
저장소와 사이트는 공개입니다. `.github/workflows/deploy.yml`은 main push에서만 실행됩니다. 작업 브랜치 push는 배포하지 않습니다.
GitHub Actions 빌드에서만 `/wedding-invitation` 경로를 적용하며 로컬 주소는 그대로 사용합니다.

공개 전: 이름·사진·문구 확정, 주소·홀·교통 공식 확인, 실제 휴대폰 검증, 공유 미리보기 이미지 설정, 시안 배너와 noindex 제거 여부 결정. 방명록은 Cloudflare Worker와 D1에 저장합니다. 사진 업로드·참석 응답 저장 기능은 없습니다. Google Fonts 로드 실패 시 시스템 기본 서체를 사용합니다.
# 디자인 비교와 네이버 지도

- `/designs/`: 여섯 테마 비교. 기존 기본 화면과 URL은 유지합니다.
- `/designs/garden-refined/`: 식물 선화와 간결한 첫 화면의 봄의 정원 개선안
- `/designs/ribbon/`: 리본과 편지 형태의 화이트 리본
- `/designs/editorial/`: 큰 대표 사진 영역과 좌측 정렬의 에디토리얼 포토
- `/` 또는 `/designs/garden/`: 봄의 정원
- `/designs/classic/`: 클래식 초대장
- `/designs/minimal/`: 미니멀
- 여섯 화면은 `src/components/Invitation.astro`와 `src/data/wedding.ts`를 공유합니다. 상단의 접힌 메뉴에서 디자인을 바꿀 수 있습니다. 테마 목록은 `src/data/themes.ts`, 추가 시안의 표지는 `NewHero.astro`에서 관리합니다.
- 지도는 기존 네이버 클라우드 `realestate` 앱의 Dynamic Map/Geocoding을 재사용합니다. 경매 사이트 설정은 유지하고 `https://ygjangontact.github.io`, `http://127.0.0.1:4325`를 추가했습니다.
- 로컬은 무시되는 `.env`의 `PUBLIC_NAVER_MAP_CLIENT_ID`, 배포는 같은 이름의 GitHub Actions repository variable을 사용합니다. 브라우저용 Client ID이며 Client Secret은 필요하지 않습니다.
- 오시는 길에 접근할 때 SDK를 불러옵니다. 공식 주소를 지오코딩해 일치하는 단일 결과에만 마커를 표시합니다. 로드 실패 시 주소와 외부 길찾기 링크를 제공합니다.
- 기존 앱의 사용량을 공유합니다. 사용량/한도는 네이버 클라우드 콘솔에서 확인하세요.
- `work/invitation`은 백업 브랜치이며 `main` push만 GitHub Pages를 배포합니다.


## 방명록 관리
- 하객은 로그인 없이 이름·한마디·관리용 비밀번호(6~128자)를 입력합니다.
- 글 아래 수정·삭제에서 작성 당시 비밀번호로 확인합니다. 비밀번호 복구 기능은 없으며, 비밀번호 없는 기존 글은 관리자만 삭제할 수 있습니다.
- 비밀번호는 글별 무작위 salt와 PBKDF2-SHA256(100,000회)로 저장하고 목록에는 반환하지 않습니다.
- 글쓰기 IP별 분당 3회, 수정·삭제 인증 IP별 분당 5회 제한입니다. Cloudflare Rate Limiting은 위치별 근사 제한이며 엄격한 전역 잠금은 아닙니다.
- 관리자: 관리자 전용 → 해당 글의 관리자 삭제 → 별도 관리자 키 입력 → 삭제 확인. 키는 브라우저 저장소에 저장하지 않습니다.
- 관리자 키는 Worker의 ADMIN_TOKEN secret입니다. 공개 코드·GitHub 변수에 넣지 않습니다. 변경: npx wrangler secret put ADMIN_TOKEN --config guestbook/wrangler.jsonc
- 기존 DB에는 guestbook/migrations/0001_passwords.sql을 한 번 적용합니다. 새 DB는 guestbook/schema.sql로 생성합니다. 두 파일을 같은 DB에 중복 적용하지 않습니다.
- Worker 배포는 npx wrangler deploy --config guestbook/wrangler.jsonc로 별도 수행합니다. main push 자동 배포는 정적 청첩장에 적용됩니다.
- 로컬 API 검증: Node 24 이상에서 node --test guestbook/worker.test.mjs (메모리 SQLite, 운영 데이터 변경 없음).


## ATM 안내 근거 (2026-11-16)
- 예식장 내부 ATM 없음: 사용자 전달 내용과 웨딩북 후기 일치.
- 같은 건물 1층 이마트24 이용: https://www.weddingbook.com/review/192628 및 https://www.weddingbook.com/review/582?reviewType=BLOG_REVIEW
- 이마트24 중림점 주소(청파로 464): https://place.clariosync.com/p/1053494/이마트24-중림점
- KB국민은행 KB손해보험 RFC본부 ATM(서소문로 21): https://www.placeview.co.kr/id/MjU2MDIwMTAz
- 신한은행 충정로역 ATM(충정로 8): https://kr.near-place.com/atm-nearby-sinhan-eunhaeng-atm-chungjeongloyeog-8-chungjeong-ro-seodaemun-gu
- 위 정보는 후기·장소 목록 기반이며 현장 운영 및 일요일 이용시간은 확인하지 않음. 편의점 ATM의 은행 소속도 미확인.
- 사이트는 지도 검색 링크를 제공하며 도보 시간·24시간 운영·수수료 면제를 보장하지 않음. 예식 전 현장 재확인 권장.


### ATM 지도 대조 및 현장 전달 내용
- 2026-11-16 네이버 지도 검색 결과에서 이마트24 중림점(청파로 464), 우리은행 ATM 한경미디어지점, 신한 충정로금융센터 ATM 충정로역을 확인.
- 사용자 정정: ATM은 1층 이마트24 **외부**에 있으며 국민은행 기기가 아님. 편의점 위치 지도에 연결하며 ATM 자체 핀으로 오인하지 않도록 표기.
- 우리은행 ATM: 청파로 463. 보조 근거 https://www.weddingbook.com/review/711?reviewType=BLOG_REVIEW 및 https://dreamermemory.tistory.com/57
- 국민은행 후보는 하객용 목록에서 제외. 개별 네이버 지도 검색 링크로 연결. 주말 운영시간·수수료는 미확인.


### 300m 이내 ATM만 표시 (2026-11-16)
- 예식장 청파로 464 기준 좌표 37.5608188,126.9682259: https://findby.co.kr/details/04510-111403101023-st-652c0cc3f27008be2c572a5e
- 우리은행 소재 건물 청파로 463 좌표 37.5601281,126.9672067: https://place.clariosync.com/p/989196/지에스25(gs25)한국경제신문사점
- 위 두 건물 좌표의 Haversine 직선거리 약 118m. 1층 이마트24 외부 ATM은 예식장과 동일 건물.
- 기존 신한 ATM 좌표(37.5596775,126.9632742)는 예식장에서 직선 약 455m이므로 제외. 근거 https://kr.near-place.com/atm-nearby-sinhan-eunhaeng-atm-chungjeongloyeog-8-chungjeong-ro-seodaemun-gu
- 건물 기준 거리이며 실제 기기·출입구까지의 보행 거리를 의미하지 않음. 목록과 지도는 동일 데이터의 2곳만 표시. 범위 밖으로 안내할 수 있는 '주변 ATM 더 찾기'는 제거.
