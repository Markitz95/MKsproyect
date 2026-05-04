
# React Native + Expo + Codespaces — Guía de Inicio

## ¿Qué es React Native?

React Native es un framework desarrollado por Meta que permite crear aplicaciones móviles para **Android e iOS** utilizando **JavaScript y React**.

La idea central es escribir una sola base de código que se renderiza utilizando **componentes nativos del sistema operativo**, lo que permite lograr buen rendimiento y experiencia de usuario.

Componentes equivalentes:

| Web | React Native |
|----|----|
| div | View |
| p | Text |
| img | Image |

---

## ¿Qué es Expo?

Expo es una plataforma que simplifica el desarrollo con React Native.

Permite:

- Crear proyectos rápidamente
- Probar apps en el teléfono con QR
- Acceder a sensores del dispositivo
- Compilar apps fácilmente

---

## Prerrequisitos

- Cuenta en GitHub
- Navegador moderno
- Teléfono con **Expo Go**

---

## Desarrollo usando GitHub Codespaces

1. Crear repositorio en GitHub
2. Abrir **Code → Codespaces → Create Codespace**
3. Se abrirá VSCode en la nube

---

## Crear proyecto Expo

En la terminal:

npx create-expo-app miApp

Entrar al proyecto:

cd miApp

Instalar dependencias:

npm install

---

## Ejecutar la app

npx expo start

Esto generará un **QR**.

Abrir Expo Go y escanear el QR.

---

## Ejemplo App.js

```javascript
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hola mundo desde React Native</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  }
});
```

---

## Componentes básicos

View — contenedor

Text — texto

Image — imágenes

Button — botones

---

## Estilos

React Native usa objetos JavaScript:

```javascript
const styles = StyleSheet.create({
  title:{
    fontSize:24,
    color:"blue"
  }
})
```

---

## Layout con Flexbox

Propiedades comunes:

flex  
flexDirection  
justifyContent  
alignItems  

---

## Estado con Hooks

```javascript
import {useState} from 'react'

const [contador,setContador] = useState(0)
```

---

## Navegación

Biblioteca recomendada:

react-navigation

Instalar:

npm install @react-navigation/native

---

## Acceso a sensores

Expo ofrece APIs para:

- GPS
- Cámara
- Acelerómetro
- Notificaciones

Ejemplo:

npx expo install expo-location

---

## Deploy

Opciones:

Expo Go  
Expo Publish  
EAS Build

---

## Flujo típico

1 Crear proyecto
2 Crear componentes
3 Probar con Expo Go
4 Conectar API
5 Compilar app

---

## Recursos

React Native
https://reactnative.dev

Expo
https://expo.dev

