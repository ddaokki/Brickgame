function changeBackgroundColor(event) {
    // 클릭된 요소의 부모인 li 요소 찾기
    var li = event.target.parentNode;
    // 선택된 요소에 클래스 추가 또는 제거
    li.classList.toggle('selected');
    // 기본 이벤트(링크 이동) 방지
    event.preventDefault();
}