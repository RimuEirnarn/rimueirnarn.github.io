const Person = (name) => {
  var data = {name: name}
  return {
    nama() {
      return data.name
    },
    async pinjamSeratus() {
      console.log(`${data.name} do pinjamSeratus`)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.round(Math.random() * 100) < 25) {
            resolve(100)
          }
          reject(0)
        }, 2000)
      })
    }
  }
}

(async () => {
  const agus = Person("agus")
  console.log("Dibayar atuh", await agus.pinjamSeratus())
})()
  .then(() => null)
  .catch((err) => console.log("Gak dibayar", err))
