fetch("https://rimueirnarn.pythonanywhere.com/api/revision")
  .then(data => data.json())
  .then(data => {
    console.log("Upstream revision: " + data.data)
  })