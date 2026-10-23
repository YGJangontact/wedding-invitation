// 이름과 사진은 준비된 뒤 이 파일에서 바꾸세요. 사진은 public/photos/에 넣습니다.
export const wedding = {
  names: ["", ""],
  date: "2027-05-09T11:00:00+09:00",
  venue: "아벤티움",
  city: "서울",
  hall: "브라운스톤서울 3층",
  address: "서울특별시 중구 청파로 464",
  venuePhone: "02-313-2480",
  locationSource: "https://www.aventium.co.kr/map.php",
  locationChecked: "2026-10-23",
  heroPhoto: "",
  photos: [] as { src: string; alt: string }[],
  invitation: [
    "서로의 일상에 가장 가까운 사람이 되어",
    "이제 같은 방향으로 걸어가려 합니다.",
    "",
    "저희의 새로운 시작에 함께해 주세요.",
  ],
  // 확인된 정보만 입력하면 해당 안내가 나타납니다.
  transport: [
    { title: "지하철", summary: "충정로역 4번 출구 · 도보 약 3분", text: "2·5호선 충정로역 4번 출구에서 약 70m 직진한 뒤 횡단보도를 건너 브라운스톤서울 3층으로 오세요.\n\n서울역에서는 15번 출구(공항철도역) 기준 도보 약 10분입니다. 서부광장으로 나와 한국경제신문사 방향으로 이동하면 맞은편에 있습니다." },
    { title: "버스", summary: "한국경제신문사 정류장 하차", text: "한국경제신문사 정류장(02516·02109)을 이용해 주세요.\n\n간선 370 · 603\n지선 7011 · 7013A · 7013B · 7017\n마을 서대문06\n공항 6015\n\n노선과 운행 정보는 출발 전 지도 앱에서 확인해 주세요." },
    { title: "자가용 · 주차", summary: "본관 또는 서소문공원 별관 주차장", text: "본관 주차장\n브라운스톤서울 · 중구 청파로 464\n\n별관 주차장\n서소문공원 · 중구 칠패로 5\n\n예식장 공식 약도는 별관 주차장 이용도 안내하고 있습니다. 도착 후 현장 안내에 따라 주차해 주세요.\n\n무료 주차 시간과 정산 방법은 예식장에 확인해 주세요." },
  ] as { title: string; summary: string; text: string }[],
  contacts: [] as { label: string; phone: string }[],
  accounts: [] as {
    label: string;
    bank: string;
    number: string;
    holder: string;
  }[],
};
