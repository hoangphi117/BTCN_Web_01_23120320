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
  const $sample = $("#sample-text");
  const $content = $(".content");
  const originalContent = $content.html();

  $("#bold, #italic, #underline, #bg-color, #color-button").on(
    "change input",
    function () {
      updateSampleText();
      updateContent();
    }
  );

  function updateSampleText() {
    $sample.removeClass("bold italic underline");

    let bg = $("#bg-color").val();
    let color = $("#color-button").val();

    if ($("#bold").is(":checked")) $sample.addClass("bold");
    if ($("#italic").is(":checked")) $sample.addClass("italic");
    if ($("#underline").is(":checked")) $sample.addClass("underline");

    $sample.css("background-color", bg);
    $sample.css("color", color);
  }

  function updateContent() {
    let isBold = $("#bold").is(":checked");
    let isItalic = $("#italic").is(":checked");
    let isUnderline = $("#underline").is(":checked");
    let bg = $("#bg-color").val();
    let color = $("#color-button").val();

    $(".highlight").css({
      "font-weight": isBold ? "bold" : "normal",
      "font-style": isItalic ? "italic" : "normal",
      "text-decoration": isUnderline ? "underline" : "none",
      "background-color": bg,
      color: color,
    });
  }

  $("#highlight").on("click", function () {
    const pattern = $("#find-word").val().trim();
    if (!pattern) return;

    let isBold = $("#bold").is(":checked");
    let isItalic = $("#italic").is(":checked");
    let isUnderline = $("#underline").is(":checked");
    let bg = $("#bg-color").val();
    let color = $("#color-button").val();

    //Xoa highlight cu~
    let content = $content
      .html()
      .replace(/<span class="highlight"[^>]*>(.*?)<\/span>/gi, "$1");

    let regex;
    try {
      regex = new RegExp(pattern, "gi");
    } catch {
      alert("Pattern không hợp lệ!");
      return;
    }

    const style = `
      ${isBold ? "font-weight:bold;" : ""}
      ${isItalic ? "font-style:italic;" : ""}
      ${isUnderline ? "text-decoration:underline;" : ""}
      background-color:${bg};
      color:${color};
    `;

    const newContent = content.replace(
      regex,
      `<span class="highlight" style="${style}">$&</span>`
    );
    $content.html(newContent);
  });

  $("#delete").on("click", function () {
    $content.html(function (_, html) {
      return html.replace(/<span class="highlight"[^>]*>(.*?)<\/span>/gi, "");
    });
  });

  $("#reset").on("click", function () {
    $content.html(originalContent);
    $("#find-word").val("");
    $("#bold, #italic, #underline").prop("checked", false);
    $("#bg-color").val("#ffffff");
    $("#color-button").val("#000000");
    $sample
      .removeClass("bold italic underline")
      .css({ "background-color": "", color: "" });
  });
});
