// 이름과 사진은 준비된 뒤 이 파일에서 바꾸세요. 사진은 public/photos/에 넣습니다.
export const wedding = {
  names: ["", ""],
  date: "2027-05-09T11:00:00+09:00",
  venue: "아벤티움",
  city: "서울",
  hall: "",
  address: "",
  heroPhoto: "",
  photos: [] as { src: string; alt: string }[],
  invitation: [
    "서로의 일상에 가장 가까운 사람이 되어",
    "이제 같은 방향으로 걸어가려 합니다.",
    "",
    "저희의 새로운 시작에 함께해 주세요.",
  ],
  // 확인된 정보만 입력하면 해당 안내가 나타납니다.
  transport: [] as { title: string; text: string }[],
  contacts: [] as { label: string; phone: string }[],
  accounts: [] as {
    label: string;
    bank: string;
    number: string;
    holder: string;
  }[],
};
