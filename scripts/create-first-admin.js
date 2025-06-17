const createFirstAdmin = async () => {
  const userUID = "WJGaXm16ZbR9xDoSlSmOoW3Qw983"

  const adminData = {
    name: "Administrador ELLP",
    email: "marjorymel48@gmail.com", 
    course: "Análise e Desenvolvimento de Sistemas",
    photo: "", 
    role: "admin",
    isVisibleOnContact: true,
    createdAt: new Date().toISOString(),
  }

  console.log("Dados do admin:", adminData)
  console.log("UID:", userUID)
}

createFirstAdmin()
