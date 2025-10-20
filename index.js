document.addEventListener("DOMContentLoaded", function () {
  const process_text =
    "All men are created equal. They are endowed by their Creator with certain inalienable rights, among them are Life, Liberty, and the pursuit of Happiness. This immortal statement was made in the Declaration of Independence of the United States of America in 1776. In a broader sense, this means: All the peoples on the earth are equal from birth, all the peoples have a right to live, to be happy and free.";

  const news_text =
    "The whole Vietnamese people, animated by a common purpose, are determined to fight to the bitter end against any attempt by the French colonialists to reconquer their country.";

  document.querySelector(".content").textContent = process_text;
  $(".news-content").text(news_text);
});

//dong bo trang thai cho nav va footer
$(function () {
  $("nav a, footer a").on("click", function (e) {
    e.preventDefault();

    const menuText = $(this).text().trim();

    $("nav a, footer a").removeClass("active");

    $(`nav a:contains(${menuText}), footer a:contains(${menuText})`).addClass(
      "active"
    );
  });
});

//nut lua chon kieu highlight
const dropdown = document.getElementById("edit-menu");
const btn = document.getElementById("edit-highlight");

btn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.classList.toggle("show");
});

//sample text
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

//dong mo news
$(function () {
  $(".toggle-expand").on("click", function () {
    const $button = $(this);

    const $content = $button.closest(".news").find(".news-content");
    const $header_bg = $button.parent();

    const $h3 = $button.siblings("h3");
    const $moveButton = $button.siblings(".toggle-move");

    if ($button.text() === "▶") {
      $button.text("▼");
      $content.show();
      $header_bg.css({ "background-color": "orange" });
      $h3.css({ color: "#f4e4cd" });
      $moveButton.css({ color: "#f4e4cd" });
      $button.css({ color: "#f4e4cd" });
    } else {
      $button.text("▶");
      $content.hide();
      $header_bg.css({ "background-color": "#f4e4cd" });
      $h3.css({ color: "#bda9a8" });
      $moveButton.css({ color: "#bda9a8" });
      $button.css({ color: "#bda9a8" });
    }
  });
});

//drag-and-drop News
$(function () {
  let dragged_element = null;
  let placeholder = null;
  let offsetX, offsetY;

  $(".toggle-move").on("mousedown", function (e) {
    dragged_element = $(this).closest(".news");
    const pos = dragged_element.offset();

    offsetX = e.pageX - pos.left;
    offsetY = e.pageY - pos.top;

    // placeholder
    placeholder = dragged_element.clone();
    placeholder.css({
      opacity: "0.3",
      visibility: "visible",
    });

    dragged_element.css({
      position: "fixed",
      width: dragged_element.outerWidth(), //giu nguyen kich thuoc khi keo
      "z-index": "1000",
      opacity: "0.5",
    });

    // chen placeholder vao vi tr cu~
    dragged_element.after(placeholder);

    dragged_element.css({
      left: e.pageX - offsetX,
      top: e.pageY - offsetY,
    });

    e.preventDefault();
    e.stopPropagation();
  });

  $(document).on("mousemove", function (e) {
    if (!dragged_element) return;

    // di chuyen element theo chuot
    dragged_element.css({
      left: e.pageX - offsetX,
      top: e.pageY - offsetY,
    });

    // tim phan tu o duoi con tro chuot
    const elementsBelow = $(document.elementsFromPoint(e.clientX, e.clientY));
    const newsBelow = elementsBelow
      .filter(".news")
      .not(dragged_element)
      .first();

    if (newsBelow.length && newsBelow[0] !== placeholder[0]) {
      const rect = newsBelow[0].getBoundingClientRect(); //lay top, left, width, height cua newsBelow[0]
      const midpoint = rect.top + rect.height / 2;

      // chen placeholder (hien thi vi tri se duoc dat xuong)
      if (e.clientY < midpoint) {
        newsBelow.before(placeholder);
      } else {
        newsBelow.after(placeholder);
      }
    }
  });

  $(document).on("mouseup", function () {
    if (!dragged_element) return;

    // Reset style
    dragged_element.css({
      position: "",
      width: "",
      "z-index": "",
      opacity: "",
      left: "",
      top: "",
    });

    // Dat phan tu dang keo vao vi tri placeholder
    placeholder.replaceWith(dragged_element);

    dragged_element = null;
    placeholder = null;
  });
});

//Drag-and-drop item

$(function () {
  $("#expand-options").on("click", function () {
    const $expand = $(this);
    const $content = $expand.closest(".add-button").find(".options");

    if ($expand.text() === "▼") {
      $expand.text("▲");
      $content.show();
    } else {
      $expand.text("▼");
      $content.hide();
    }
  });

  $(".options li").on("click", function () {
    $(".options li").removeClass("selected-option");
    $(this).addClass("selected-option");
    $(".selected").contents().first()[0].textContent = $(this).text() + " ";

    const $content = $(this).closest(".add-button").find(".options");
    const $expand = $(this).closest(".add-button").find("#expand-options");
    $expand.text("▼");
    $content.hide();
  });

  $(".add-button #add-new").on("click", function () {
    const selected = $(".options .selected-option").text();
    if (selected) {
      $(".dd-content").append(`<div class="animal-item">${selected}</div>`);
    }
  });

  let dragged = null;
  let placeholder = null;
  let offsetX = 0,
    offsetY = 0;

  $(".dd-content").on("mousedown", ".animal-item", function (e) {
    dragged = $(this);
    const pos = dragged.offset();
    offsetX = e.pageX - pos.left;
    offsetY = e.pageY - pos.top;

    placeholder = $("<div class='placeholder'></div>").height(
      dragged.outerHeight()
    );
    dragged.after(placeholder);

    dragged.css({
      position: "fixed",
      width: dragged.outerWidth(),
      height: dragged.outerHeight(),
      "z-index": 1000,
      left: e.pageX - offsetX,
      top: e.pageY - offsetY,
      cursor: "default",
      transition: "none",
    });

    e.preventDefault();
  });

  // Tim cac .animal-item khac tai toa do (x,y)
  function findItemAtPoint(x, y) {
    const elems = document.elementsFromPoint(x, y);
    for (let el of elems) {
      const $el = $(el).closest(".animal-item");
      if ($el.length && !$el.is(dragged) && !$el.is(placeholder)) {
        return $el;
      }
    }
    return $();
  }

  $(document).on("mousemove", function (e) {
    if (!dragged) return;

    // di chuyen phan tu duoc keo
    dragged.css({
      left: e.pageX - offsetX,
      top: e.pageY - offsetY,
    });

    const $target = findItemAtPoint(e.clientX, e.clientY);
    if ($target.length) {
      const rect = $target[0].getBoundingClientRect();
      const isBefore = e.clientY < rect.top + rect.height / 2;

      if (isBefore) {
        $target.before(placeholder);
      } else {
        $target.after(placeholder);
      }
    }
  });

  $(document).on("mouseup", function () {
    if (!dragged) return;

    const targetOffset = placeholder.offset();

    dragged.animate(
      {
        left: targetOffset.left,
        top: targetOffset.top,
        opacity: 1,
      },
      150,
      function () {
        dragged
          .css({
            position: "",
            width: "",
            height: "",
            "z-index": "",
            left: "",
            top: "",
            opacity: "",
            cursor: "",
            transition: "",
          })
          .insertAfter(placeholder);

        placeholder.remove();
        placeholder = null;
        dragged = null;
      }
    );
  });
});
