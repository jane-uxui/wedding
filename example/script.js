  const firebaseConfig = {
  apiKey: "AIzaSyAS8ehPOt7nrVgTPZmPp0tlZqirXnhmwOk",
  authDomain: "m-card-2f3d7.firebaseapp.com",
  projectId: "m-card-2f3d7",
  storageBucket: "m-card-2f3d7.firebasestorage.app",
  messagingSenderId: "291865229583",
  appId: "1:291865229583:web:0a326b61e95b113321667a",
  measurementId: "G-Q79S6QB4KY"
  };
  
  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();






  // 익명 로그인 처리
  firebase.auth().signInAnonymously().catch(console.error);

  // 댓글 남기기
  function saveMsg() {
  const name = document.getElementById('name').value.trim();
  const pw = document.getElementById('pw').value;
  const msg = document.getElementById('msg').value.trim();
  if (!name || !pw || !msg) { 
    alert("모두 입력!"); 
    return; 
  }

  const today = new Date();
  const dateStr = today.getFullYear() + '.' + 
                  String(today.getMonth() + 1).padStart(2, '0') + '.' + 
                  String(today.getDate()).padStart(2, '0');

  db.collection('messages').add({
    name, 
    pw, 
    msg, 
    time: Date.now(), 
    date: dateStr   // ← 저장할 때 같이 넣음
  }).then(loadMsg);

  document.getElementById('msg').value = '';
}



  // 댓글 목록 불러오기
  function loadMsg() {
  db.collection('messages').orderBy('time', 'desc').get()
    .then(snapshot => {
      const list = document.getElementById('list');
      list.innerHTML = ''; // 기존 내용 초기화
      snapshot.forEach(doc => {
        const data = doc.data();
        list.innerHTML += `
          <div class="card">
            <div class="title_wrap">
              <div class="name">${data.name}</div>
              <div class="right_wrap">
                <div class="date">${data.date || 'YYYY.MM.DD'}</div>
                <button class="del" onclick="delMsg('${doc.id}')">&times;</button>
              </div>
            </div>
            <div class="msg">${data.msg}</div>
          </div>
        `;
      });
    })
    .catch(error => {
      console.error('메시지 로드 중 에러:', error);
    });
}


  // 삭제 시 비밀번호 검사
  function delMsg(id) {
    const inputPw = prompt('비밀번호 입력:');
    db.collection('messages').doc(id).get().then(doc => {
      if (doc.exists && doc.data().pw === inputPw) {
        db.collection('messages').doc(id).delete().then(loadMsg);
      } else { alert('비밀번호 불일치!'); }
    });
  }
  
  db.collection('messages')
  .orderBy('time', 'desc')
  .onSnapshot(snapshot => {
    const list = document.getElementById('list');
    list.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      list.innerHTML += `
        <div class="card">
            <div class="title_wrap">
              <div class="name">${data.name}</div>
              <div class="right_wrap">
                <div class="date">${data.date || 'yyyy.mm.dd'}</div>
                <button class="del" onclick="delMsg('${doc.id}')">&times;</button>
              </div>
            </div>
            <div class="msg">${data.msg}</div>
          </div>
      `;
    });

  });


//   window.onload = function() {
//   var container = document.getElementById('map');
//   var options = {
//     center: new kakao.maps.LatLng(37.3815349667371, 126.6597361315122),
//     level: 2
//   };
//   var map = new kakao.maps.Map(container, options);

//   var marker = new kakao.maps.Marker({
//     position: new kakao.maps.LatLng(37.3815349667371, 126.6597361315122)
//   });
//   marker.setMap(map);
// };


document.addEventListener("DOMContentLoaded", () => {
  const openGallery = document.getElementById("more");
  const openCall = document.getElementById("call")
  const popup = document.getElementById("gallery_popup");
  const telpopup = document.getElementById("tel_popup")
  const dimmed = document.getElementById("dimmed");
  const closeBtn = popup.querySelector(".close");
  const telCloseBtn = telpopup.querySelector(".close");

  const slidesContainer = popup.querySelector(".slides");
  const slides = popup.querySelectorAll(".slide");
  const nextBtn = popup.querySelector(".btn-next");
  const prevBtn = popup.querySelector(".btn-prev");

  let currentSlide = 0;
  const maxSlide = slides.length - 1;

  // 팝업 열기
  openGallery.addEventListener("click", () => {
    popup.style.display = "grid";
    dimmed.style.display = "block";
    goToSlide(0);
  });
  openCall.addEventListener("click",() => {
    telpopup.style.display = "block"
    dimmed.style.display = "block";
  })


  // 팝업 닫기
  function closePopup() {
    popup.style.display = "none";
    dimmed.style.display = "none";
    telpopup.style.display = "none";
  }

  closeBtn.addEventListener("click", closePopup);
  dimmed.addEventListener("click", closePopup);
  telCloseBtn.addEventListener("click", closePopup);
  
  // 슬라이드 이동
  function goToSlide(slide) {
    slidesContainer.style.transform = `translateX(${-100 * slide}%)`;
    currentSlide = slide;
  }

  function nextSlide() {
    currentSlide = currentSlide === maxSlide ? 0 : currentSlide + 1;
    goToSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = currentSlide === 0 ? maxSlide : currentSlide - 1;
    goToSlide(currentSlide);
  }

  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  // 키보드 네비게이션 지원 (← →, ESC)
  document.addEventListener("keydown", (e) => {
    if (popup.style.display === "grid") {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "Escape") closePopup();
    }
  });
});

const infoWrap = document.querySelector(".info_wrap");
const slides = document.querySelectorAll(".info_wrap > div");
const prevBtn = document.querySelector(".btn.prev");
const nextBtn = document.querySelector(".btn.next");

let currentSlide = 0;

function showSlide(index) {
  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = 0;
  currentSlide = index;
  const offset = -index * 50; // %
  infoWrap.style.transform = `translateX(${offset}%)`;
}

prevBtn.addEventListener("click", () => {
  showSlide(currentSlide - 1);
});

nextBtn.addEventListener("click", () => {
  showSlide(currentSlide + 1);
});

// 초기 상태
showSlide(0);
