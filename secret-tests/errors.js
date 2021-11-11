function errors(key){
  const a = { error1 : "Ошибка1", error2 : "Ошибка 2"}
  console.log('\x1b[31m' + a[key] + '\x1b[0m')
  process.exit(1)
}


module.exports = { errors }
