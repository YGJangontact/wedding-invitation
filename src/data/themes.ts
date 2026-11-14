export const themes = [
  {id:'garden-refined',name:'봄의 정원 개선안',short:'정돈한 봄의 정원',description:'가는 식물 선화와 세이지빛 아치. 초대의 글을 차분하게 읽는 구성.',fresh:true},
  {id:'ribbon',name:'화이트 리본',short:'화이트 리본',description:'흰 편지지 위에 작은 리본 하나. 이름과 예식 안내가 중심인 초대장.',fresh:true},
  {id:'editorial',name:'에디토리얼 포토',short:'에디토리얼 포토',description:'큰 대표 사진과 선명한 글자 배치. 함께한 장면이 중심인 구성.',fresh:true},
  {id:'thread',name:'붉은 실 스크롤',short:'붉은 실 스크롤',description:'내릴수록 붉은 실이 섹션을 이으며 그려지고, 초대의 글이 한 줄씩 밝아지는 구성.',fresh:true,scroll:true},
  {id:'mono',name:'먹과 여백',short:'먹과 여백',description:'흰 바탕과 먹색만. 큰 05 / 09 숫자, 내릴 때 사진이 열리고 문단이 조용히 떠오르는 구성.',fresh:true,scroll:true},
  {id:'garden',name:'봄의 정원',short:'봄의 정원',description:'세이지색 아치와 꽃 장식이 있는 기존 시안.',fresh:false},
  {id:'classic',name:'클래식 초대장',short:'클래식 초대장',description:'크림색 종이와 이중 테두리의 기존 시안.',fresh:false},
  {id:'minimal',name:'미니멀',short:'미니멀',description:'날짜와 여백을 강조한 기존 시안.',fresh:false},
];
export const scrollThemes = themes.filter(t=>'scroll' in t && t.scroll).map(t=>t.id);
export const sitePath = (path:string) => `${import.meta.env.BASE_URL.replace(/\/$/,'')}/${path.replace(/^\//,'')}`;
