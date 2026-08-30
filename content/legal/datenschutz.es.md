Este sitio está construido para saber lo mínimo posible sobre usted. Lo que aun así llega a saber está aquí — completo y sin la dilución habitual.

# 1. Responsable

Lucas Steckel  
Ackerstraße 4A  
45701 Herten  
Alemania  
Correo electrónico: [lucassteckel04@gmail.com](mailto:lucassteckel04@gmail.com)  
Teléfono: +49 177 5836332

No hay delegado de protección de datos designado; no se dan los requisitos legales para ello.

# 2. El resumen corto

- Sin rastreo, sin herramientas de analítica, sin publicidad, sin elaboración de perfiles.
- Sin cookies. Lo que se guarda en el navegador se queda en el navegador.
- Ninguna fuente, script o imagen de servidores ajenos — **salvo** en la página del foro (sección 5) y en GeoBingo (sección 6).
- Sin registro en el foro no se crea cuenta alguna ni dato alguno sobre su persona almacenado de forma duradera por mi parte.

---

# 3. Acceso al sitio (hosting)

Este sitio lo sirve **GitHub Pages**, un servicio de GitHub B.V., Prins Bernhardplein 200, 1097 JB Ámsterdam, Países Bajos, filial de GitHub, Inc. (EE. UU.).

Al acceder, GitHub procesa datos de conexión técnicamente necesarios, en particular su dirección IP, fecha y hora, la dirección solicitada, el referrer y datos del navegador y del sistema operativo. Sin estos datos no se puede servir una página. Yo mismo no tengo acceso a esos registros y no los analizo.

**Base jurídica:** art. 6, apdo. 1, letra f del RGPD. El interés legítimo es el funcionamiento seguro y operativo del sitio.

**Transferencia a terceros países:** es posible un tratamiento en EE. UU. GitHub se apoya para ello en las cláusulas contractuales tipo de la Comisión Europea (art. 46, apdo. 2, letra c del RGPD) y está certificada bajo el EU-U.S. Data Privacy Framework. Declaración de privacidad de GitHub: [docs.github.com/site-policy/privacy-policies/github-privacy-statement](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement).

# 4. Qué se guarda en su navegador

Este sitio no coloca cookies. Deposita hasta seis valores en el almacenamiento local (`localStorage`) de su navegador:

| Clave | Contenido | Finalidad |
| --- | --- | --- |
| `theme` | `light` u `dark` | recuerda la apariencia elegida |
| `skillry:hinweis` | que usted cerró el aviso de abajo a la izquierda | no volver a mostrarlo en cada visita |
| `level` | la profundidad elegida en la sección Aprender | mostrar el mismo nivel en la próxima visita |
| `skillry:who` | su nombre visible y si su correo está confirmado | muestra en la cabecera que tiene sesión iniciada |
| `gb:name` | el nombre que se puso en GeoBingo | aparece ya escrito en el campo |
| `gb:lobby` | el código de la última sala en la que entró | le devuelve a la misma ronda tras recargar |

El aviso de abajo a la izquierda **no es un banner de consentimiento**, y tampoco finge serlo: aquí no hay nada que consentir, porque no se coloca nada que requiriera un consentimiento. Dice qué hay guardado localmente y remite aquí. Un botón de «Aceptar todo» sin nada que aceptar sería una formalidad que entrena a la gente a cerrar sin leer lo que en otros sitios sí importa.

Los dos primeros solo se crean si usted usa de verdad el conmutador correspondiente. El tercero se crea exclusivamente al iniciar sesión y desaparece al cerrarla. Los dos últimos solo se crean si juega a GeoBingo; el código de sala desaparece en cuanto abandona la ronda. Ninguno de los valores contiene un token, y ninguno se envía a ninguna parte.

`skillry:who` merece una explicación, porque es la razón de que la cabecera pueda saludarle sin que ninguna página hable con Google. El estado de la sesión vive en realidad en Firebase; consultarlo allí significaría cargar el SDK de Firebase en **cada** página — y con eso la promesa de la sección 5, que todas las páginas salvo el foro y GeoBingo no cargan nada de servidores ajenos, dejaría de ser cierta. En su lugar, el inicio de sesión escribe este único valor localmente, y todas las demás páginas solo lo leen. No contiene token ni dirección de correo y no da derecho a nada — quien lo falsifique a mano en su navegador consigue un nombre ajeno en la esquina de su pantalla y un rechazo de la base de datos.

Ninguno de estos valores se transmite a mí ni a terceros, y todos pueden borrarse en cualquier momento desde los ajustes de su navegador.

**Base jurídica:** § 25, apdo. 2, n.º 2 TDDDG — el almacenamiento es necesario para ofrecer una función expresamente solicitada por usted. No hace falta consentimiento para ello, y por eso aquí tampoco hay banner.

Con el foro en uso y sesión iniciada, Firebase deposita además un token de sesión en el almacenamiento local (véase la sección 5).

---

# 5. El foro

El foro es la única parte de este sitio que almacena datos personales de forma duradera. Funciona sobre **Firebase Authentication** y **Cloud Firestore**, servicios de Google Ireland Limited, Gordon House, Barrow Street, Dublín 4, Irlanda.

## 5.1 Establecimiento de la conexión

En cuanto abre la página del foro, su navegador carga el SDK de Firebase desde `www.gstatic.com` y establece una conexión con servidores de Google. Con ello su dirección IP se transmite a Google — **también si usted no inicia sesión**. Todas las demás páginas de este sitio no cargan nada de servidores ajenos — con una excepción: GeoBingo, véase la sección 6. Esta frase estuvo aquí hasta el 26.08.2026 sin esa salvedad. Se cambió porque de otro modo habría dejado de ser cierta.

**Base jurídica:** art. 6, apdo. 1, letra f del RGPD. El interés legítimo es operar un foro sin infraestructura de servidores propia.

## 5.2 Cuenta e inicio de sesión

El registro se hace con dirección de correo y contraseña. La contraseña la procesa y guarda exclusivamente Firebase en forma de hash; este código fuente no la ve en claro en ningún momento y no la almacena en ninguna parte.

Firebase Authentication procesa para ello: dirección de correo, hash de la contraseña, un identificador de usuario (UID), el estado de confirmación del correo y los momentos de creación y del último inicio de sesión. Para la defensa contra abusos, Google procesa además la dirección IP y datos del dispositivo.

Para escribir se requiere una dirección de correo **confirmada**. Para ello Firebase envía un correo de confirmación. No es un fin en sí mismo: sin ese umbral, un foro es un relé abierto.

**Base jurídica:** art. 6, apdo. 1, letra b del RGPD (prestación de la función solicitada por usted) y art. 6, apdo. 1, letra f del RGPD para la defensa contra abusos.

## 5.3 Publicaciones

De cada tema y cada respuesta se guardan: el nombre visible que usted eligió, su identificador de usuario, título y texto de la publicación, y el momento. **Las publicaciones son públicas y legibles por cualquiera sin registro.** Su dirección de correo no se muestra en ellas.

Elija un nombre visible que pueda ser tan público como con ello se vuelve. Lo que escribe en una publicación lo decide usted — no incluya nada que no deba quedar a la vista de todos.

Al borrar, las publicaciones no se eliminan del todo, sino que se marcan como borradas. El texto se sustituye, la entrada en sí permanece, para que el hilo de una conversación no desaparezca en mitad de una discusión. A petición conforme al art. 17 del RGPD, el registro se elimina por completo.

## 5.4 Transferencia a terceros países

Google procesa datos también en EE. UU. La base son las cláusulas contractuales tipo de la Comisión Europea según el art. 46, apdo. 2, letra c del RGPD; Google LLC está certificada bajo el EU-U.S. Data Privacy Framework. El tratamiento está regulado mediante un contrato de encargo según el art. 28 del RGPD (Google Cloud Data Processing Addendum). Declaración de privacidad de Google: [policies.google.com/privacy](https://policies.google.com/privacy).

# 6. GeoBingo

GeoBingo es un juego de este sitio que transcurre dentro de **Google Street View**. Es, junto al foro, la segunda parte de esta oferta que habla con un servidor ajeno, y la única que lo hace con Google Maps Platform.

## 6.1 Cuándo se carga algo siquiera

Mientras usted solo lee la página, no se carga nada de Google. Solo cuando abre una sala o se une a una, su navegador carga el SDK de Firebase desde `www.gstatic.com`. Solo cuando una ronda empieza de verdad, carga además la biblioteca de mapas desde `maps.googleapis.com`. A partir de cada uno de esos momentos, su dirección IP ha llegado a Google.

Este orden es deliberado: quien lee el texto explicativo y se va, no ha hablado con Google.

**Base jurídica:** art. 6, apdo. 1, letra b del RGPD. Sin Street View el juego no existe, y lo inicia usted.

## 6.2 Qué llega a saber Google con ello

Al mostrar un panorama y al reconstruir la imagen de un hallazgo, su navegador transmite a Google: su dirección IP, datos del navegador y del dispositivo, el identificador del panorama solicitado con la dirección de la vista, y la dirección de esta página como referrer. Rigen las condiciones de uso de Google Maps Platform y la declaración de privacidad de Google: [policies.google.com/privacy](https://policies.google.com/privacy).

**Su propia ubicación no se consulta.** La consulta de ubicación del navegador no se usa en ningún punto, y los sensores de movimiento del dispositivo están expresamente desactivados en el panorama. Los lugares en los que aterriza durante el juego salen de un dado y no tienen nada que ver con el suyo.

## 6.3 Qué hay en la base de datos

Una sala vive en la misma Cloud Firestore que el foro (véase la sección 5) y contiene: el código de cinco caracteres, el nombre visible de cada jugador y su identificador de usuario, la lista de palabras, y por cada hallazgo el identificador del panorama con dirección de la vista, inclinación, ángulo de imagen y coordenada.

**Un hallazgo no es una imagen.** No se sube nada y no se guarda ningún archivo de imagen — solo los cinco números con los que Google reconstruye la misma imagen.

Una sala es accesible exclusivamente por su código. No existe una lista de todas las salas: la regla de la base de datos permite consultar un código concreto y prohíbe listar. Quien abandona la ronda o cierra la pestaña es retirado de la lista de jugadores. Si el anfitrión abandona la sala, esta se borra junto con palabras y hallazgos; una sala abandonada la retira una regla de limpieza de Firestore 24 horas después de su creación.

## 6.4 Inicio de sesión con Google

**Desde el 29.08.2026, GeoBingo exige iniciar sesión con una cuenta de Google.** Antes había un código de acceso delante de la página. Estaba en texto claro dentro del archivo entregado — mantenía alejados a visitantes casuales, nada más, y la página lo decía así. Para un evento en el que el acceso se concede de forma dirigida, no valía nada.

Al iniciar sesión, **Firebase Authentication** (Google Ireland Limited) procesa: su dirección de correo, el nombre visible que tiene registrado en Google, un identificador de usuario (UID) y los momentos de creación y del último inicio de sesión. Para la defensa contra abusos, Google procesa además la dirección IP y datos del dispositivo. Aquí no se pide ni se guarda contraseña alguna — el inicio de sesión ocurre en Google.

**Base jurídica:** art. 6, apdo. 1, letra b del RGPD. Sin inicio de sesión la función no existe, y la activa usted.

**Quién puede abrir una ronda se autoriza individualmente.** Para ello se guarda junto a su identificador de usuario: dirección de correo, nombre visible, rol y el momento de la autorización. Si solicita una autorización, los mismos datos se guardan temporalmente como solicitud hasta que se acepte o se rechace. Ambas cosas las ve exclusivamente el operador.

Esta comprobación ocurre **en los servidores de Google y no en el navegador**. Esa es toda la diferencia con el código anterior: una regla que corre en el navegador puede esquivarla cualquiera que maneje el navegador.

Jugar en la ronda de otra persona funciona con cualquier cuenta con sesión iniciada, en cuanto tenga un enlace de invitación — para eso no hace falta autorización. El anfitrión puede, sin embargo, limitar su sala a cuentas autorizadas y retirar jugadores.

# 7. GitHub Discussions

En varios puntos se enlaza a GitHub Discussions. Es una oferta externa; si escribe allí, rigen las condiciones y la declaración de privacidad de GitHub, y solo interviene una cuenta que en cualquier caso administra usted.

# 8. Plazos de conservación

- **Registros del servidor en GitHub:** según los plazos de GitHub, sin intervención mía.
- **Cuenta y publicaciones:** hasta que borre la cuenta o solicite la eliminación.
- **Salas y hallazgos en GeoBingo:** hasta que el anfitrión abandone la sala, como muy tarde 24 horas después de su creación.
- **Valores en el almacenamiento local:** hasta que los borre en su navegador.

# 9. Sus derechos

Según el RGPD, usted tiene derecho de acceso (art. 15), rectificación (art. 16), supresión (art. 17), limitación del tratamiento (art. 18), portabilidad de los datos (art. 20) y **oposición a los tratamientos basados en el art. 6, apdo. 1, letra f del RGPD (art. 21)**. Un consentimiento otorgado puede revocarlo en cualquier momento con efecto para el futuro.

Para todo ello basta un mensaje informal a [lucassteckel04@gmail.com](mailto:lucassteckel04@gmail.com).

Independientemente de ello, le asiste el derecho a reclamar ante una autoridad de control (art. 77 del RGPD). La competente es:

> Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2–4, 40213 Düsseldorf — [ldi.nrw.de](https://www.ldi.nrw.de/)

# 10. Sin decisiones automatizadas

No hay toma de decisiones automatizada, incluida la elaboración de perfiles, según el art. 22 del RGPD. Los resultados de análisis del índice de skills se refieren a software, no a personas.

# 11. Cambios

Esta declaración se adapta cuando cambia algo de la oferta aquí descrita. La versión vigente está siempre en esta dirección; su evolución puede seguirse en el historial público del código fuente.
