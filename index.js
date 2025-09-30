import getIncludedIds from "./getIncludedIds.js";
import bookOptions from "./bookOptions.js";
import { prettySlug } from "./prettySlug.js";

const randomButton = document.getElementById("get-random");
const suttaArea = document.getElementById("sutta");
const translatorInfo = document.getElementById("translator-info");
const getDaily = document.getElementById("get-daily");
const clickInstruction = document.getElementById("click-instruction");

// BUILDING YOUR OWN VERSION OF THIS APP
// [ ] remove Google Tracking Script from end of index.html
// [ ] update/translate specified tags in <head>  at top of index.html
// [ ] change language and translator below as needed
const language = "vi";
const translator = "minh_chau";
// [ ] below needs to be translated when changing to a new language
const disclaimer =
  "Lưu ý: Công cụ chọn kinh ngẫu nhiên này không phải để dùng như một cách nhận câu trả lời từ vũ trụ về giáo pháp (Dhamma) mà bạn cần nghe nhất vào thời điểm hiện tại. Đây chỉ là một đoạn mã lập trình. Tốt hơn hết, bạn nên hỏi một thiện tri thức (kalyanamitta) đáng tin cậy về giáo pháp để bạn học tập.";
clickInstruction.innerText = "Nhấn để khám phá";
const buttonText = "Bài kinh ngẫu nhiên";
translatorInfo.innerText = "Tất cả các bản dịch đều do Hòa Thượng Thích Minh Châu thực hiện, được đăng tải trên trang SuttaCentral.net";
getDaily.innerHTML = `Nhận một bài kinh mới qua email mỗi ngày từ <a href="http://daily.readingfaithfully.org" title="Daily Suttas" rel="noreferrer" target="_blank">Daily.ReadingFaithfully.org</a>`;
// end of building your own version

bookOptions();

randomButton.addEventListener("click", e => {
  e.preventDefault();
  const ids = getIncludedIds();
  // console.log(ids);
  const randomNumber = Math.floor(Math.random() * ids.length);
  // console.log(randomNumber);
  // console.log(ids[randomNumber]);
  // document.location.search = "?" + ids[randomNumber];
  console.log(ids[randomNumber]);
  buildSutta(ids[randomNumber]);
  history.pushState({ page: ids[randomNumber] }, "", `?q=${ids[randomNumber]}`);
});

function buildSutta(slug) {
  slug = slug.toLowerCase().trim();
  randomButton.innerText = "...";
  fetch(`https://suttacentral.net/api/suttas/${slug}/${translator}?lang=${language}`)
    .then(response => response.json())
    .then(data => {
      const html = data.root_text?.text || "<p>Đang cập nhật.</p>";
      const scLink = `<a href="https://suttacentral.net/${slug}/${language}/${translator}"  title="Open in SuttaCentral.net" rel="noreferrer" target="_blank"><img height="20px" src="./images/favicon-sc.png"></a>`;
      const scLightLink = `<a href="https://sc.readingfaithfully.org/?q=${slug}"  title="Open in SC Light" rel="noreferrer" target="_blank"><img height="15px" src="./images/favicon-sc-light-tan.png"></a>`;
      const citationHelperLink = `<a href="https://sutta.readingfaithfully.org/?q=${slug}"  title="Open in Citation Helper" rel="noreferrer" target="_blank"><img height="17px" src="./images/favicon-CH.png" ></a>`;
      suttaArea.innerHTML = '<p class="sc-link">' + scLink + citationHelperLink + scLightLink + "</p>" + html;
      const pageTile = document.querySelector("h1");
      document.title = pageTile.textContent;
      pageTile.innerHTML = `<span class="citation">${prettySlug(slug)}</span> ${pageTile.textContent}`;
      randomButton.innerText = buttonText;
    })
    .catch(error => {
      console.log("Đã xảy ra lỗi");
      buildSutta(ids[Math.floor(Math.random() * ids.length)]);
    });
}

// initialize
if (document.location.search) {
  buildSutta(document.location.search.replace("?q=", ""));
} else {
  suttaArea.innerHTML = `<div class="instructions">${disclaimer}</div>`;
  randomButton.innerText = buttonText;
}
