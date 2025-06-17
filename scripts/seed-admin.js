import { getFirestore, doc, setDoc } from "firebase/firestore"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"

const createFirstAdmin = async () => {
  const auth = getAuth()
  const db = getFirestore()

  try {
    // Criar usuário no Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, "admin@ellp.com", "senha123")

    // Criar documento do usuário no Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      name: "Administrador ELLP",
      email: "admin@ellp.com",
      course: "Ciência da Computação",
      photo: "",
      role: "admin",
      isVisibleOnContact: true,
      createdAt: new Date().toISOString(),
    })

    console.log("Administrador criado com sucesso!")
  } catch (error) {
    console.error("Erro ao criar administrador:", error)
  }
}

createFirstAdmin()
