/*
 *  Author  :   Aakash Chauhan
 *  Date    :   October 24, 2023
 */
document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault();

  var formData = new FormData(event.target);
  var formObject = {};
  formData.forEach(function (value, key) {
    formObject[key] = value;
  });
  const curr_url = formObject.myurl;
  console.log(curr_url);

  link = curr_url.charAt(4) == "s" ? curr_url.slice(8) : curr_url.slice(7);
  f = 1;
  let domain = "",
    path = "";
  for (let i = 0; i < link.length; i++) {
    // spliting domain and path
    if (f && link[i] == "/") {
      f = 0;
    }
    if (f) {
      domain += link[i];
    } else {
      path += link[i];
    }
  }

  host_length = (url) => {
    let count = 0,
      f = 0;

    for (let i = 0; i < url.length; i++) {
      if (url[i] == "/" && url[i - 1] == "/") {
        for (let j = i + 1; j < url.length; j++) {
          count++;
          if (url[j + 1] == "/") {
            f = 1;
            break;
          }
        }
      }
      //     if (f) break;
    }
    return count;
  };

  count_x = (url, x) => {
    const dotCount = url.split(x).length - 1;
    return dotCount;
  };

  count_num = (url) => {
    let digitCount = 0;

    for (let i = 0; i < url.length; i++) {
      if (!isNaN(parseInt(url[i]))) {
        digitCount++;
      }
    }
    return digitCount;
  };

  phisHints = (url) => {
    let x = 0;
    x = count_x(curr_url, "wp");
    x = x + count_x(curr_url, "login");
    x = x + count_x(curr_url, "includes");
    x = x + count_x(curr_url, "admin");
    x = x + count_x(curr_url, "site");
    x = x + count_x(curr_url, "images");
    x = x + count_x(curr_url, "js");
    x = x + count_x(curr_url, "alibaba");
    x = x + count_x(curr_url, "css");
    x = x + count_x(curr_url, "myaccount");
    x = x + count_x(curr_url, "dropbox");
    x = x + count_x(curr_url, "themes");
    x = x + count_x(curr_url, "plugins");
    x = x + count_x(curr_url, "signin");
    x = x + count_x(curr_url, "view");

    return x;
  };

  values = {
    lenght_url: curr_url.length,
    length_hostname: host_length(curr_url),
    //   ip: is_ip(curr_url),
    nb_dots: count_x(curr_url, "."),
    nb_hyphens: count_x(curr_url, "-"),
    nb_at: count_x(curr_url, "@"),
    nb_qm: count_x(curr_url, "?"),
    nb_and: count_x(curr_url, "&"),
    nb_or: count_x(curr_url, "|"),
    nb_eq: count_x(curr_url, "="),
    nb_underscore: count_x(curr_url, "_"),
    nb_tilde: count_x(curr_url, "~"),
    nb_percent: count_x(curr_url, "%"),
    nb_slash: count_x(curr_url, "/"),
    nb_star: count_x(curr_url, "*"),
    nb_colan: count_x(curr_url, ":"),
    nb_comma: count_x(curr_url, ","),
    nb_semicolumn: count_x(curr_url, ";"),
    nb_dollar: count_x(curr_url, "$"),
    nb_space: count_x(curr_url, " "),
    nb_www: count_x(curr_url, "www"),
    nb_com: count_x(path, "com"), // in path
    nb_dslash: count_x(curr_url, "//"),
    https_token: curr_url.charAt(4) == "s" ? 0 : 1, // jiske pass hai vo 0 jiske pass nahi h vo 1
    ratio_digits_url: count_num(curr_url) / curr_url.length,
    ratio_digits_host: count_num(domain) / domain.length,
    prefix_suffix: count_x(domain, "-") == 0 ? 0 : 1,
    path_extention:
      count_x(curr_url, "exe") ||
      count_x(curr_url, "txt") ||
      count_x(curr_url, "js") ||
      count_x(curr_url, "apk")
        ? 1
        : 0,
    phish_hints: phisHints(curr_url),
  };
  console.log(values);
  console.log(values);
  document.write(curr_url);



  //   Sending to app.py

  // Using AJAX to send data to Flask app
  var xhr = new XMLHttpRequest();
  var url = "/"; // Replace with the actual Flask route

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // Handle the response from the Flask app if needed
      console.log(xhr.responseText);
    }
  };

  var jsonData = JSON.stringify(values);
  xhr.send(jsonData);
});
