# VerificaMoto PE — Documento Consolidado de Reglas, Algoritmo y Base Legal

Este documento contiene la estructura de preguntas (quiz), las reglas de clasificación del algoritmo local y el marco legal peruano vigente (actualizado a julio de 2026) que utiliza la aplicación web **VerificaMoto PE**. Este archivo está optimizado para servir como fuente limpia en **NotebookLM**.

---

## 1. Estructura de Preguntas del Formulario (Quiz Flow)

El cuestionario consta de 7 preguntas que definen las características físicas y operativas del vehículo eléctrico en consulta:

1. **Activación del motor (`act`):**
   * **Pedaleo asistido (`ped`):** El motor solo se activa al pedalear (tracción humana asistida).
   * **Acelerador manual o botón (`ace`):** El motor puede funcionar sin necesidad de pedalear.

2. **Velocidad máxima de construcción (`vel`):**
   * **Hasta 12 km/h (`12`):** Velocidades de recreación/juguete.
   * **Más de 12 km/h hasta 25 km/h (`25`):** Rango típico para VMP y bicicletas eléctricas.
   * **Más de 25 km/h (`+25`):** Supera el límite de VMP y bicicletas.

3. **Potencia nominal del motor (`pot`):**
   * **Hasta 350 Watts (`350`):** Límite máximo para bicicletas de Pedaleo Asistido (SPA).
   * **Más de 350 Watts (`+350`):** Motores de mayor potencia.

4. **Capacidad de pasajeros por diseño (`pas`):**
   * **Solo 1 persona (`1`):** Asiento individual diseñado de fábrica para un conductor.
   * **2 o más personas (`+1`):** Asientos dobles, estribos o espacio de carga integrado de fábrica.

5. **Peso neto del vehículo (`pes`):**
   * **Hasta 120 kg (`120`):** Límite máximo de peso para VMP y SPA.
   * **Más de 120 kg (`+120`):** Vehículos pesados o de carga.

6. **Kit de visibilidad permanente del vehículo (`vis`):**
   * **Sí (`si`):** Cuenta con luz delantera, luz de freno posterior y láminas/cintas retrorreflectantes laterales de fábrica.
   * **No (`no`):** No dispone del kit de visibilidad permanente (obligatorio por ley para VMP, SPA y motos, tanto de día como de noche).

7. **Configuración física del vehículo (`dis`):**
   * **Scooter / Monopatín (`sco`):** Plataforma para ir de pie o sillín plegable/removible, sin carrocería de motocicleta.
   * **Motocicleta / Trimoto (`mot`):** Asiento fijo de fábrica, chasis/carenado con apariencia de motocicleta, o espejos y comandos de luces de serie.
   * **Hard trigger (RNV / AAP):** Si la configuración física es de motocicleta (`mot`), el vehículo se clasifica **automáticamente como Vehículo Automotor Categoría L**, sin importar velocidad ni potencia declaradas. La naturaleza jurídica se determina por la configuración mecánica y de fábrica, no solo por el software o la potencia.

---

## 2. Reglas del Algoritmo Local de Clasificación

El sistema clasifica el vehículo en una de cuatro categorías según las respuestas anteriores:

### A. Ciclo — Bicicleta con Pedaleo Asistido (SPA)
* **Requisitos para clasificar como SPA:**
  * Activación por pedaleo (`ped`).
  * Potencia del motor hasta 350W (`350`).
  * Velocidad máxima hasta 25 km/h (rango `12` o `25`).
  * Peso total hasta 120 kg (`120`).
* **Estado legal:**
  * **No constituye vehículo automotor.**
  * **EXENTO** de Placa (SUNARP), SOAT y Brevete (Licencia).
  * **Permitido circular en:** Ciclovías y calzadas (carril derecho).
  * **Prohibido circular en:** Aceras/veredas.
  * **Obligatorio:** Casco y kit de visibilidad permanente (luz delantera, luz de freno posterior y láminas retrorreflectantes laterales).

### B. Vehículo de Movilidad Personal (VMP)
* **Requisitos para clasificar como VMP:**
  * Activación por acelerador manual (`ace`).
  * Velocidad máxima mayor a 12 km/h y hasta 25 km/h (`25`).
  * Capacidad de pasajeros de fábrica: solo 1 persona (`1`).
  * Peso total hasta 120 kg (`120`).
* **Estado legal:**
  * **No forma parte de la clasificación vehicular convencional del Anexo I del RNV.**
  * **EXENTO** de inmatriculación en SUNARP, Placa, SOAT y Brevete.
  * **Permitido circular en:** Ciclovías y calzadas (carril derecho, junto al cordón de la acera).
  * **Prohibido circular en:** Aceras/veredas y vías expresas.
  * **Obligatorio:** Kit de visibilidad permanente: luz delantera, luz de freno posterior y láminas retrorreflectantes laterales (día y noche).

### C. Vehículo Automotor Eléctrico (Categoría L)
* **Condiciones que fuerzan la clasificación como Vehículo Automotor (Cat. L1, L2, L3, etc.):**
  * Si tiene pedaleo asistido pero supera los 350W de potencia o los 25 km/h de velocidad.
  * Si la velocidad de construcción supera los 25 km/h (`+25`).
  * Si el diseño del vehículo permite llevar a más de 1 persona (`+1`).
  * Si el peso neto del vehículo supera los 120 kg (`+120`).
* **Estado legal:**
  * **Clasificado como Vehículo Automotor.**
  * **OBLIGATORIO:** Inscripción en SUNARP, Placa de rodaje física, SOAT vigente y Brevete de Categoría B2 (B-IIa mínimo para bicimotos).
  * **Permitido circular en:** Calzada (pista).
  * **ESTRICTAMENTE PROHIBIDO:** Circular por ciclovías y aceras/veredas.
  * **Aditamentos obligatorios de fábrica:** Casco de seguridad homologado (número de placa grabado/impreso), chaleco o chaqueta retrorreflectiva, luz delantera encendida permanentemente (inclusive de día), dos espejos retrovisores laterales, luces direccionales intermitentes (delanteras y traseras) y bocina o corneta eléctrica.

### D. No Clasificado
* **Requisitos:** Velocidad máxima de fábrica de 12 km/h o menos (`12`) operado por acelerador.
* **Estado legal:** No cumple la velocidad mínima para ser considerado VMP (>12 km/h). Caso no regulado directamente por el MTC para ciclovías rápidas. Se prohíbe su uso en aceras.

---

## 3. Base Legal y Normativa Peruana Citada

La aplicación sustenta sus respuestas y clasificaciones en el siguiente marco normativo peruano:

1. **Resolución Directoral N.° 0016-2026-MTC/18:**
   * Establece las directrices y límites para los Vehículos de Movilidad Personal (VMP). Define la velocidad máxima permitida de hasta 25 km/h y la prohibición de llevar acompañantes.
2. **Decreto Supremo N.° 019-2018-MTC:**
   * Modifica el Reglamento Nacional de Vehículos e introduce las categorías especiales para vehículos eléctricos menores (Bicicletas SPA y ciclomotores).
3. **Decreto Supremo N.° 012-2020-MTC:**
   * Regula el uso de la bicicleta y los vehículos de movilidad personal como modos de transporte sostenible, especificando los derechos y obligaciones de los conductores.
4. **Decreto Supremo N.° 058-2003-MTC (Reglamento Nacional de Vehículos - RNV):**
   * Establece las categorías vehiculares oficiales (Anexo I) y los requisitos técnicos de homologación para la inmatriculación en SUNARP.
5. **Resolución N.° 039-2013-SUNARP/SN:**
   * Regula la inmatriculación y el registro de propiedad vehicular ante la Superintendencia Nacional de los Registros Públicos para vehículos menores de categoría L.
6. **Decreto Supremo N.° 016-2009-MTC (Reglamento Nacional de Tránsito):**
   * Contiene el cuadro de infracciones, sanciones y medidas preventivas aplicables a conductores a nivel nacional.

---

## 4. Cuadro de Infracciones y Multas (Fiscalización 2026)

A partir del **2 de agosto de 2026**, las autoridades peruanas aplicarán multas efectivas y medidas preventivas (internamiento en el depósito) a los conductores de vehículos que infrinjan las siguientes normas:

| Infracción | Código / Tipo | Multa (Soles) | Condición / Detalle |
| :--- | :--- | :--- | :--- |
| **Circular por la ciclovía** | Infracción G32 | **S/ 550** (10% UIT) | Solo permitido para ciclos, SPA y VMP. Prohibido para motocicletas/bicimotos de Categoría L. |
| **Circular sin placa de rodaje** | Infracción | **S/ 660** (12% UIT) | Obligatorio para todos los vehículos motorizados de Categoría L. |
| **Circular sin SOAT vigente** | Infracción | **S/ 660** (12% UIT) | Obligatorio para todos los vehículos motorizados de Categoría L. |
| **Conducir sin licencia correspondiente** | Infracción | **S/ 2,750** (50% UIT) | Se requiere Licencia de conducir clase B (mínimo B-IIa) para vehículos Categoría L. |
| **Circular sin casco reglamentario o prendas reflectantes** | Infracción E1 (Leve) | **S/ 220** | Falta de equipo de seguridad obligatorio (casco homologado y chaleco/j Chaqueta retrorreflectivo) para Categoría L. |
| **Invasión de ciclovías vulnerando derecho preferente (Cat. L)** | Infracción M43 | **S/ 660** (12% UIT) | Motos eléctricas (Cat. L) prohibidas en ciclovías; vulnera la preferencia de ciclistas/VMP. |

*Nota: El valor de las sanciones está calculado con base en la UIT (Unidad Impositiva Tributaria). La suma de infracciones concurrentes puede provocar la retención e internamiento del vehículo en el depósito municipal.*
