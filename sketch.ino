#include <Servo.h> 

const int SENSOR_CO2_PIN = A0;      
const int LED_CRITICO_PIN = 13;       // LED Vermelho
const int LED_ATENCAO_PIN = 12;       // LED Amarelo
const int LED_SEGURO_PIN = 11;        // LED Azul

const int SERVO_CAPTURA_PIN = 9;      // Servo de Admissão de CO2
const int SERVO_INJECAO_PIN = 10;     // Servo de Injeção Subterrânea

// Limiares para o sensor
const int LIMIAR_ATENCAO = 350;     
const int LIMIAR_CRITICO = 700;    
                                        
const int VALVULA_FECHADA = 0;   
const int VALVULA_ABERTA = 90;   

Servo servoCaptura;
Servo servoInjecao;

// Variável para armazenar a última leitura do sensor
int ultimoNivelCO2 = -1; 

void setup() {
  Serial.begin(9600);

  pinMode(LED_CRITICO_PIN, OUTPUT);
  pinMode(LED_ATENCAO_PIN, OUTPUT);
  pinMode(LED_SEGURO_PIN, OUTPUT);

  servoCaptura.attach(SERVO_CAPTURA_PIN);
  servoInjecao.attach(SERVO_INJECAO_PIN);

  // Inicializa o sistema no estado seguro
  digitalWrite(LED_CRITICO_PIN, LOW);
  digitalWrite(LED_ATENCAO_PIN, LOW);
  digitalWrite(LED_SEGURO_PIN, HIGH);
  servoCaptura.write(VALVULA_FECHADA);
  servoInjecao.write(VALVULA_FECHADA);

  Serial.println("SISTEMA DE CAPTURA DE CARBONO (CCS) INICIALIZADO");
}

void loop() {
  int nivelCO2 = analogRead(SENSOR_CO2_PIN);

  // O sistema só entra aqui se o valor atual for diferente do último registrado
  if (nivelCO2 != ultimoNivelCO2) {
    
    // Atualiza a variável de controle com o novo valor
    ultimoNivelCO2 = nivelCO2;

    Serial.print("Nivel de CO2 alterado para (Sensor A0): ");
    Serial.println(nivelCO2);

    // ESTADO 1: Nível Seguro de CO2 (Nível baixo)
    if (nivelCO2 < LIMIAR_ATENCAO) {
      Serial.println("Estado: Ar Limpo. Sistema em Standby.\n");
      
      digitalWrite(LED_SEGURO_PIN, HIGH);
      digitalWrite(LED_ATENCAO_PIN, LOW);
      digitalWrite(LED_CRITICO_PIN, LOW);

      servoCaptura.write(VALVULA_FECHADA);
      servoInjecao.write(VALVULA_FECHADA);
    }
    // ESTADO 2: Nível em Alerta (Filtros ativos capturando)
    else if (nivelCO2 >= LIMIAR_ATENCAO && nivelCO2 < LIMIAR_CRITICO) {
      Serial.println("Estado: Captura Ativa. Filtrando CO2 atmosferico.\n");

      digitalWrite(LED_SEGURO_PIN, LOW);
      digitalWrite(LED_ATENCAO_PIN, HIGH);
      digitalWrite(LED_CRITICO_PIN, LOW);

      servoCaptura.write(VALVULA_ABERTA); // Abre a comporta de sucção externa
      servoInjecao.write(VALVULA_FECHADA); // Mantém poço subterrâneo fechado
    }
    // ESTADO 3: Nível Crítico (Direcionando para armazenamento geológico)
    else { 
      Serial.println("Estado: Saturacao Maxima. Injetando CO2 no Subsolo!\n");

      digitalWrite(LED_SEGURO_PIN, LOW);
      digitalWrite(LED_ATENCAO_PIN, LOW);
      digitalWrite(LED_CRITICO_PIN, HIGH);

      servoCaptura.write(VALVULA_FECHADA); // Pausa a entrada para focar na injeção
      servoInjecao.write(VALVULA_ABERTA);  // Descarrega o CO2 no poço profundo
    }
  }

  delay(100); // Reduzimos o delay para tornar a resposta ao deslizar o sensor mais rápida
}