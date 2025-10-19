document.addEventListener("DOMContentLoaded", function () {
  const process_text =
    "All men are created equal. They are endowed by their Creator with certain inalienable rights, among them are Life, Liberty, and the pursuit of Happiness. This immortal statement was made in the Declaration of Independence of the United States of America in 1776. In a broader sense, this means: All the peoples on the earth are equal from birth, all the peoples have a right to live, to be happy and free.";

  document.querySelector(".content").textContent = process_text;
});

const dropdown = document.getElementById("edit-menu");
const btn = document.getElementById("edit-highlight");

btn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.classList.toggle("show");
});

$(function () {
  $("#bold, #italic, #underline, #bg-color").on("change input", function () {
    let $word = $("#sample-text");

    $word.removeClass("bold italic underline");

    if ($("#bold").is(":checked")) $word.addClass("bold");
    if ($("#italic").is(":checked")) $word.addClass("italic");
    if ($("#underline").is(":checked")) $word.addClass("underline");

    let bg = $("#bg-color").val();

    $word.css("background-color", bg);
  });
});
