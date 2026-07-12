// Explicações detalhadas de cada componente
const explanations = {
  sensor: `
    No protótipo montado no Wokwi, um <strong>sensor de umidade de solo</strong> faz o papel do
    sensor real de CO₂, entregando ao Arduino uma leitura analógica entre 0 e 1023 na porta A0. 
    No microcontrolador, esse sinal é linearmente mapeado por código (usando a função <code>map()</code>)
    para corresponder à escala realista de <strong>350 a 1200 ppm</strong> exibida no painel.
    <br><br>
    No sistema real de <strong>Captura Direta de Ar (DAC)</strong>, essa medição é feita por
    sensores de infravermelho não dispersivo (NDIR) ou fotoacústicos, que detectam quanto de
    radiação infravermelha o CO₂ presente no ar absorve. A média global de concentração atmosférica
    está atualmente em torno de 420 ppm.
  `,
  servo1: `
    O primeiro servomotor (<strong>pino 9</strong>) simula a comporta de admissão de ar dos
    coletores. Quando a concentração atinge a faixa de atenção (<strong>entre 450 e 800 ppm</strong>),
    o servo gira até 90°, representando a abertura física das grades dos coletores.
    <br><br>
    Nos equipamentos reais de DAC, essa etapa ativa os 
    <strong>ventiladores industriais</strong>, forçando o ar ambiente a passar por contactores
    químicos (geralmente contendo aminas líquidas ou sólidas) que aprisionam seletivamente as moléculas de CO₂.
  `,
  servo2: `
    O segundo servomotor (<strong>pino 10</strong>) representa a válvula de injeção geológica,
    acionada quando a leitura ultrapassa os <strong>800 ppm</strong> — representando o limite de saturação 
    da célula de captura.
    <br><br>
    No sistema real, o sorvente saturado passa por uma etapa de
    <strong>regeneração térmica</strong> (aquecimento), liberando o CO₂ em alta pureza. O gás é então
    comprimido a altas pressões até atingir estado supercrítico e é injetado em profundidades de 1 a 2 km 
    para mineralização no subsolo.
  `,
  leds: `
    Os três LEDs (<strong>pinos 11, 12 e 13</strong>) formam o painel de status do sistema,
    resumindo em um sinal visual único o que os sensores estão medindo:
    <br><br>
    • <strong>Azul:</strong> nível de CO₂ seguro (abaixo de 450 ppm).<br>
    • <strong>Amarelo:</strong> captura ativa (entre 450 e 800 ppm).<br>
    • <strong>Vermelho:</strong> ciclo de compressão e injeção (acima de 800 ppm).
  `
};

function showExplanation(type, btn) {
  document.querySelectorAll('.component-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById('explanation-box').innerHTML = explanations[type];
}

document.querySelectorAll('.component-btn').forEach(btn => {
  btn.addEventListener('click', () => showExplanation(btn.dataset.target, btn));
});

// Simulador de concentração de CO2
const slider = document.getElementById('co2-range');
const co2Val = document.getElementById('co2-val');

const ledSeguro = document.getElementById('led-seguro');
const ledAtencao = document.getElementById('led-atencao');
const ledCritico = document.getElementById('led-critico');

const statusSeguro = document.getElementById('status-seguro');
const statusAtencao = document.getElementById('status-atencao');
const statusCritico = document.getElementById('status-critico');

const arrow1 = document.getElementById('arrow1');
const arrow2 = document.getElementById('arrow2');
const arrow3 = document.getElementById('arrow3');

const co2Marker = document.getElementById('co2-marker');
const co2MarkerLabel = document.getElementById('co2-marker-label');
const mineralDots = document.getElementById('mineral-dots');
const reservoir = document.getElementById('reservoir');
const injectionPipe = document.getElementById('injection-pipe');
const pipeTransfer = document.getElementById('pipe-transfer');
const fans = document.querySelectorAll('#fan-grid .fan');

// Posições (cx, cy) do marcador de CO2 na vista isométrica:
// atmosfera (livre) -> muro de ventiladores (captura) -> reservatório (injeção)
const POS = {
  safe:      { x: 465, y: 90,  label: { x: 482, y: 94 } },
  attention: { x: 425, y: 420, label: { x: 442, y: 424 } },
  critical:  { x: 725, y: 650, label: { x: 742, y: 654 } }
};

function resetVisuals() {
  [ledSeguro, ledAtencao, ledCritico].forEach(el => {
    el.style.backgroundColor = '';
    el.style.boxShadow = '';
  });
  [statusSeguro, statusAtencao, statusCritico].forEach(el => {
    el.style.borderLeftColor = 'var(--line)';
  });
  [arrow1, arrow2, arrow3].forEach(el => el.style.color = 'var(--line)');
  fans.forEach(f => f.classList.remove('active'));
  pipeTransfer.style.stroke = '';
  injectionPipe.style.stroke = '';
  injectionPipe.style.filter = '';
  reservoir.style.fill = '';
}

function moveMarker(pos, color) {
  co2Marker.setAttribute('cx', pos.x);
  co2Marker.setAttribute('cy', pos.y);
  co2MarkerLabel.setAttribute('x', pos.label.x);
  co2MarkerLabel.setAttribute('y', pos.label.y);
  co2Marker.style.fill = color;
}

function updateSimulation(val) {
  co2Val.textContent = val;
  resetVisuals();

  if (val < 450) {
    ledSeguro.style.backgroundColor = 'var(--safe)';
    ledSeguro.style.boxShadow = '0 0 10px var(--safe)';
    statusSeguro.style.borderLeftColor = 'var(--safe)';
    moveMarker(POS.safe, 'var(--safe)');
    mineralDots.style.opacity = 0;
  } else if (val < 800) {
    ledAtencao.style.backgroundColor = 'var(--warning)';
    ledAtencao.style.boxShadow = '0 0 10px var(--warning)';
    statusAtencao.style.borderLeftColor = 'var(--warning)';
    arrow1.style.color = 'var(--warning)';
    arrow2.style.color = 'var(--warning)';
    fans.forEach(f => f.classList.add('active'));
    pipeTransfer.style.stroke = 'var(--warning)';
    moveMarker(POS.attention, 'var(--warning)');
    mineralDots.style.opacity = 0;
  } else {
    ledCritico.style.backgroundColor = 'var(--danger)';
    ledCritico.style.boxShadow = '0 0 10px var(--danger)';
    statusCritico.style.borderLeftColor = 'var(--danger)';
    arrow1.style.color = 'var(--danger)';
    arrow2.style.color = 'var(--danger)';
    arrow3.style.color = 'var(--danger)';
    injectionPipe.style.stroke = 'var(--danger)';
    injectionPipe.style.filter = 'drop-shadow(0 0 4px var(--danger))';
    reservoir.style.fill = 'rgba(255,93,74,0.18)';
    moveMarker(POS.critical, 'var(--rock)');
    mineralDots.style.opacity = 1;
  }
}

slider.addEventListener('input', function () {
  updateSimulation(parseInt(this.value, 10));
});

// Estado inicial
showExplanation('sensor', document.querySelector('.component-btn[data-target="sensor"]'));
updateSimulation(parseInt(slider.value, 10));

// Alternância dinâmica das rotas ao clicar
const routeCards = document.querySelectorAll('.route');

routeCards.forEach(card => {
  // Clique com o mouse
  card.addEventListener('click', () => {
    setActiveRoute(card);
  });

  // Acessibilidade via teclado (teclas Enter ou Espaço)
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveRoute(card);
    }
  });
});

function setActiveRoute(selectedCard) {
  routeCards.forEach(c => c.classList.remove('active'));
  selectedCard.classList.add('active');
}