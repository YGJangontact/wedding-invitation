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

공개 전: 이름·사진·문구 확정, 주소·홀·교통 공식 확인, 실제 휴대폰 검증, 공유 미리보기 이미지 설정, 시안 배너와 noindex 제거 여부 결정. 현재 방명록·사진 업로드·참석 응답 저장 기능은 없습니다. Google Fonts 로드 실패 시 시스템 기본 서체를 사용합니다.
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
