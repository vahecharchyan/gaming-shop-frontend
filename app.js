let basket = JSON.parse(localStorage.getItem("basket")) || [];
let discount = localStorage.getItem("discount") || 10;
function cart_count(basket) {
  if (basket.length > 0) {
    let result = basket.reduce((s, e) => (s += e.quantity), 0);
    $(".count").html(result);
  } else {
    $(".count").html(0);
  }
}
cart_count(basket);
function slide() {
  let currentSlide = 0;
  let portfolio_items = $(".portfolio-container .portfolio-item").length;
  $(".move-slide").click(function () {
    let width =
      $(".portfolio-container").outerWidth() /
      $(".portfolio-item").outerWidth();

    let step = $(this).data("step");
    console.log(portfolio_items);

    if (currentSlide + +step > portfolio_items - width) {
      currentSlide = 0;
    } else if (currentSlide + +step === -1) {
      currentSlide = portfolio_items - width;
    } else {
      currentSlide += +step;
    }
    $(".portfolio-container").css(
      "transform",
      "translateX(-" + currentSlide * (100 / width) + "%)"
    );
  });
}
function productPage() {
  portfolioCategory.forEach((e) => {
    e.addEventListener("click", () => {
      window.location.href = "products.html";
    });
  });
}
function add_to_cart(id, price, quantity) {
  let item = basket.find((e) => e.id == id);
  if (item) {
    item.quantity++;
  } else {
    basket.push({
      id: id,
      quantity: 1,
      price,
    });
  }
  console.log(basket);
  localStorage.setItem("basket", JSON.stringify(basket));
  $(".count").text(+$(".count").text() + 1);
}
function createproducts(portfolioItems) {
  let products = document.querySelector(".portfolio-container");
  products.innerHTML = "";

  portfolioItems.forEach((e) => {
    let portfolioItem = document.createElement("div");
    portfolioItem.classList.add("portfolio-item");

    portfolioItem.innerHTML = `
        <a href="single-product.html#${e.id}"><picture><img src="${e.img}" alt=""></picture></a>
          <div class="title">${e.title}</div>
          <div class="price">$${e.price}</div>
        <button class="add-to-cart">Add to Cart</button>`;
    $(portfolioItem)
      .find(".add-to-cart")
      .click(function () {
        add_to_cart(e.id, e.price, 1);
      });
    products.appendChild(portfolioItem);
  });
}
function getCategories(portfolioItems) {
  let categories = portfolioItems.reduce((obj, product) => {
    if (product.category === undefined) {
      return obj;
    } else if (!obj[product.category]) {
      obj[product.category] = [product];
    } else {
      obj[product.category].push(product);
    }
    return obj;
  }, {});
  return categories;
}
function show_categories(categories, count) {
  let categoryEl = document.querySelector(".products-category");
  let countCategories = 0;
  // console.log(categories);
  for (let category in categories) {
    if (countCategories >= 3) break;
    countCategories++;
    let portfolioItem = document.createElement("div");
    portfolioItem.classList.add("portfolio-item");

    portfolioItem.innerHTML = `
          <a href="products.html#${category}"><img src="${categories[category][0].img}" alt="">
          <div class="desc">${category}</div></a>`;
    categoryEl.appendChild(portfolioItem);
  }
}
function chat() {
  document.querySelector(".chat").addEventListener("click", () => {
    document.querySelector(".overlaychat").classList.remove("none");
  });

  document.querySelector(".closechat").addEventListener("click", () => {
    document.querySelector(".overlaychat").classList.add("none");
  });

  let question = document.querySelector(".question");
  let answer = document.querySelector(".answer");
  question.addEventListener("click", () => {
    question.classList.add("none");
    answer.classList.remove("none");
  });
}
function cart_calculate() {
  let final_price = basket.reduce((sum, e) => sum + e.price * e.quantity, 0);
  let discounted = final_price - (final_price * discount) / 100;
  $(".discounted_price").html(`$ ${(final_price - discounted).toFixed(2)}`);
  $(".final_price_all").html(`$<del>${final_price.toFixed(2)}</del>`);
  $(".final_price_discounted").html(`$${discounted.toFixed(2)}`);
  $(".product_original_price").each(function () {
    $price_block = $(this).closest(".price");
    $price = $(this).text();
    $sale_price = $price - ($price * discount) / 100;
    $price_block.find(".discounted_rate").text($sale_price.toFixed(2));
  });
}

if ($("#homepage").length > 0) {
  let overlay = document.querySelector(".overlay");
  document.querySelector("#hero button").addEventListener("click", () => {
    overlay.classList.toggle("none");
  });
  let close = document.querySelector(".close").addEventListener("click", () => {
    overlay.classList.add("none");
  });

  createproducts(portfolioItems);
  slide();

  createproducts(portfolioItems);
  show_categories(getCategories(portfolioItems), 3);

  $(window).resize(function () {
    currentSlide = 0;
    $(".portfolio-container").css("transform", "translateX(0%)");
  });
}
if ($("#products_page").length > 0) {
  let active_category = window.location.hash.slice(1) || "All categories";
  const categories = getCategories(portfolioItems);
  if (active_category !== "All categories") {
    createproducts(categories[active_category]);
  } else {
    createproducts(portfolioItems);
  }
  for (let category in categories) {
    $(".categories").append(`<div class = "caty pointer">${category}</div>`);
  }

  $(".categories").on("click", "div", function () {
    let category = $(this).text();
    if (category === active_category) return;

    window.location.href = "#" + category;
    active_category = category;
    if (category in categories) {
      createproducts(categories[category]);
    } else {
      createproducts(portfolioItems);
    }
  });
}

if ($("#singleproduct").length > 0) {
  let el_id = window.location.hash.slice(1);
  let product = portfolioItems.find((e) => e.id == el_id);
  if (product) {
    $(".show_product").html(`
      <div class="col w-50">
          <div class="wrapper">
              <picture><img
                      src="${product.img}"
                      alt=""></picture>
              <div class="desc">${product.desc}</div>
          </div>
      </div>
      <div class="col">
          <div class="wrapper">
              <div class="title-2">${product.title}</div>
              <div class="rate">$ ${product.price.toFixed(2)}</div>
              <div class="btn add_to_cart"><button class="btnpurple">Add to Cart</button></div>
              <div><button class="btnwhite">Buy Now</button></div>
          </div>
      </div>
       
      `);
    $(".show_product")
      .find(".add_to_cart")
      .click(function () {
        add_to_cart(product.id, product.price, 1);
      });
  }
}
chat();

let scrolled = 0;
document.onscroll = function (ev) {
  if (scrollY <= 150) {
    scrolled = scrollY;
    return;
  } else if (scrolled < scrollY) {
    document.querySelector("header").classList.add("header-hide");
  } else {
    document.querySelector("header").classList.remove("header-hide");
  }
  scrolled = scrollY;
};

if (document.querySelector("#cart")) {
  let cart_products = document.querySelector(".cart_products");
  basket.forEach((e) => {
    let product = portfolioItems.find((el) => el.id == e.id);
    if (product) {
      let cart_product = document.createElement("div");
      cart_product.classList.add("row");
      let discounted = product.price - (product.price * discount) / 100;
      cart_product.innerHTML = `
                <div class="col cart_product w-100">
                    <div class="wrapper flex align-center justify-between">
                    <div class="flex w-40">
                            <picture><img
                                    src="${product.img}"
                                    alt=""></picture>
                          <div>
                            <div class="title">${product.title}</div>
                            <div class="price"> $<del class="product_original_price">${
                              product.price
                            }</del> $<span class="discounted_rate">$ ${discounted}</span> </div>
                        </div>
                    </div>
                        <div class="flex quantity_control">
                            <div class="minus qunatity_change" data-step="-1">-</div>
                            <div class="countpr">${e.quantity}</div>
                            <div class="plus qunatity_change" data-step="1">+</div>
                        </div>
                  
                        <div class="final_price"> $${(
                          discounted * e.quantity
                        ).toFixed(2)}</div>
          
       
                  
                        <div class="trash"><i class="fa-solid fa-trash overlay-toggle"></i></div>
                    </div>
                </div>
                `;

      cart_calculate();
      cart_product.querySelectorAll(".qunatity_change").forEach((el) => {
        el.addEventListener("click", () => {
          if (e.quantity + +el.dataset.step <= 0) return;
          e.quantity = e.quantity + +el.dataset.step;
          cart_product.querySelector(".countpr").innerHTML = e.quantity;
          cart_product.querySelector(".final_price").innerHTML = `$ ${(
            discounted * e.quantity
          ).toFixed(2)}`;
          cart_calculate();
          cart_count(basket);

          localStorage.setItem("basket", JSON.stringify(basket));
        });
      });
      cart_product.querySelector(".trash").addEventListener("click", () => {
        $(".overlay-small").html(`
                      <div class="delete_question">Are you sure you want to delete <b>${product.title}</b> ? </div>
                      <div class="flex">
                        <button class="overlay-toggle">NO</button>
                        <button class="remove_product">YES</button>
                      </div>
                      <div class="close overlay-toggle overlay_toggle">X</div>

                    `);
        $(".overlay_page").toggle();
        $(".overlay-small").toggle(100);
        $(".overlay_page").click(function () {
          $(".overlay-small").hide(100);
          $(".overlay_page").hide(100);
        });
        $(".close").click(function () {
          $(".overlay-small").toggle(100);
          $(".overlay_page").toggle(100);
        });
        $(".overlay-small")
          .find("button")
          .click(function () {
            if ($(this).hasClass("remove_product")) {
              $(cart_product).hide(100).remove();
              let elIndex = basket.findIndex((el) => el.id === e.id);
              basket.splice(elIndex, 1);
              localStorage.setItem("basket", JSON.stringify(basket));
              cart_count(basket);
              cart_calculate();
            }
            $(".overlay-small").toggle(100);
          });
      });

      cart_products.appendChild(cart_product);
    }
  });
  cart_calculate();
  $(".apply_discount").click(function () {
    let code = $(this).siblings("input").val();
    let code_el = promocodes.find((e) => e.code === code);
    if (code_el) {
      discount = code_el.discount;
      localStorage.setItem("discount", discount);
      cart_calculate();
    }
  });
}
function checkNumber(e) {
  if (/^[\d]+$/.test(e)) {
    return true;
  } else {
    return false;
  }
}
if ($("#register_page").length > 0) {
  $("form").submit(function (e) {
    e.preventDefault();
    $(this)
      .find("input")
      .each((i, el) => {
        $(el).val($(el).val().trim());
        if ($(el).val() === "") {
          $(el).addClass("border-danger");
        } 
        else {
          if ($(el).data("typeNumber") !== undefined) {
            console.log($(el).val())
          } 
          else {
            $(el).removeClass("border-danger");
          }
        }
      });
  });

  $('[data-empty-input]').keyup(function(e){
    if($(this).val() === ''){
      $(this).addClass('border-danger');
    }
    else{
      $(this).removeClass('border-danger');
    }
  })
  $('[data-type-number]').keypress(function(e){
    if(!/[0-9]/.test(e.key)){
      e.preventDefault();
    }
  })

  let passwordErrors = [];
 
  $('[data-type-password]').keyup(function(e){
    if($(this).val().trim() == ''){
      $(this).addClass('border-danger')
      // return;
    }
    if(!/[0-9]/.test($(this).val())){
      passwordErrors.push('<div>passwrod must have at least 1 digit</div>')
    }
    if(!/[A-Z]/.test($(this).val())){
      passwordErrors.push('<div>passwrod must have at least 1 uppercase letter</div>')
    } 
    if(!/[a-z]/.test($(this).val())){
      passwordErrors.push('<div>passwrod must have at least 1 lowercase letter</div>')
    
    }
    if(!/[!@#$%^&*(_)+\-=\[\]{};':"\\|,.<>\/?]/.test($(this).val())){
      passwordErrors.push('<div>passwrod must have at least 1 symbol</div>')
    
    }
    if($(this).val().length < 12){
      passwordErrors.push('<div>Password must contain at leaset 12 characters</div>')
    
    }
    if(passwordErrors.length > 0){
      $(this).addClass('border-danger')
      $(this).siblings('.passwrod-error').html(passwordErrors.join(' '))
     }
    else{
      $(this).removeClass('border-danger')
      $(this).siblings('.passwrod-error').html('')
    }

    passwordErrors = [];
  })
  $('[data-type-number]').on('paste',function(e){
    e.preventDefault();
  })
}

  // document.querySelectorAll('#off .col').forEach( (e, i) =>{
  //   if(scrollY >= e.offsetTop - window.innerHeight + 200){
  //       if(i % 2 === 0){
  //           e.classList.add('animate__bounceInLeft')
  //       }
  //       else{
  //           e.classList.add('animate__bounceInRight')
  //       }
  //       e.style.opacity = 1;
  //   }
  // })


  window.addEventListener('scroll', () => {
    document.querySelectorAll('#off .col').forEach((e, i) => {
      let rect = e.getBoundingClientRect();
      let elementTop = rect.top;
  
      if (elementTop <= window.innerHeight - 200) {
        if (!e.classList.contains('animate__animated')) {
          e.classList.add('animate__animated');
          e.classList.add(i % 2 === 0 ? 'animate__bounceInLeft' : 'animate__bounceInRight');
          e.style.opacity = 1;
        }
      }
    });
  });
  