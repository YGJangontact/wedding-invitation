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
