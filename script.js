// ==========================================
// 1. EXPLICAÇÕES SEQUENCIAIS (PASSO A PASSO)
// ==========================================
const explanations = {
  sensor: `
    <span class="btn-num" style="color: var(--safe); font-weight: 600; font-family: var(--font-mono); font-size: 0.8rem; display: block; margin-bottom: 4px;">Fase 01 · Detecção Ambiental</span>
    <h3>Monitoramento e Captação de Fluxo</h3>
    <p>
        <strong>No protótipo:</strong> O sensor analógico de CO₂ (simulado pelo sensor de umidade de solo no pino A0) 
        realiza varreduras contínuas, enviando o sinal elétrico convertido ao microcontrolador para estimar a concentração local em ppm.
    </p>
    <p>
        <strong>No sistema real (DAC):</strong> Sensores de infravermelho não dispersivo (NDIR) de alta precisão 
        monitoram as correntes de ar, umidade e temperatura. Como o dióxido de carbono está altamente diluído na 
        atmosfera livre (representando apenas 0,04% do ar, ou cerca de 420 ppm), o monitoramento preciso do vento 
        e das variáveis ambientais orienta o controle de vazão das grandes unidades contatores.
    </p>
  `,
  servo1: `
    <span class="btn-num" style="color: var(--warning); font-weight: 600; font-family: var(--font-mono); font-size: 0.8rem; display: block; margin-bottom: 4px;">Fase 02 · Retenção Química</span>
    <h3>Filtração e Adsorção do Carbono</h3>
    <p>
        <strong>No protótipo:</strong> Ao atingir a faixa de alerta (acima de 450 ppm), o primeiro servomotor (pino 9) 
        abre fisicamente os coletores para capturar o gás excedente.
    </p>
    <p>
        <strong>No sistema real (DAC):</strong> Gigantescos ventiladores industriais forçam o ar atmosférico a passar 
        por estruturas chamadas de contatores químicos, que utilizam reagentes específicos para capturar o CO₂:
        <br>• <em>Sistemas Sólidos (Adsorção)</em>: Filtros porosos impregnados com compostos químicos chamados aminas retêm quimicamente o CO₂ na sua superfície por afinidade molecular.
        <br>• <em>Sistemas Líquidos (Absorção)</em>: O ar passa por uma névoa de solução alcalina (como Hidróxido de Potássio), que se liga quimicamente ao gás, purificando a saída. O restante do ar limpo retorna à atmosfera.
    </p>
  `,
  servo2: `
    <span class="btn-num" style="color: var(--danger); font-weight: 600; font-family: var(--font-mono); font-size: 0.8rem; display: block; margin-bottom: 4px;">Fase 03 · Separação e Purificação</span>
    <h3>Regeneração Térmica e Compressão</h3>
    <p>
        <strong>No protótipo:</strong> No estágio crítico de saturação (acima de 800 ppm), o segundo servomotor (pino 10) 
        abre a tubulação simulando o isolamento do CO₂ para pressurização.
    </p>
    <p>
        <strong>No sistema real (DAC):</strong> Uma vez que os filtros estão repletos de carbono, os coletores são fechados e 
        isolados do exterior. Inicia-se a fase de <strong>Regeneração (Dessorção)</strong>: o sistema aplica calor (cerca de 100°C 
        para sistemas sólidos e até 900°C para sistemas líquidos) para quebrar as ligações químicas estáveis, liberando o CO₂ puro. 
        Este gás isolado é seco e comprimido sob alta pressão (>100 bar) até atingir o estado supercrítico (um fluido denso que 
        facilita o transporte seguro).
    </p>
  `,
  leds: `
    <span class="btn-num" style="color: var(--ink-dim); font-weight: 600; font-family: var(--font-mono); font-size: 0.8rem; display: block; margin-bottom: 4px;">Fase 04 · Estocagem Geológica</span>
    <h3>Injeção e Mineralização de Carbono</h3>
    <p>
        <strong>No protótipo:</strong> Os LEDs do circuito (pinos 11, 12 e 13) exibem os modos operacionais e asseguram que 
        o ciclo do circuito está em sincronia.
    </p>
    <p>
        <strong>No sistema real (DAC):</strong> O CO₂ supercrítico purificado é bombeado através de dutos e poços vedados para 
        profundidades entre 1.000 e 2.000 metros no subsolo. O fluido é introduzido em formações rochosas basálticas porosas ou arenitos 
        salinos. Ao entrar em contato com os minerais da rocha (como magnésio, ferro e cálcio), o CO₂ reage naturalmente em um processo 
        de mineralização in-situ. Em poucos anos, ele se transforma em carbonato sólido estável, prendendo o carbono de forma 
        permanente na estrutura mineral geológica.
    </p>
  `
};

// Gerenciamento de exibição do box explicativo
function showExplanation(type, btn) {
  document.querySelectorAll('.component-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById('explanation-box').innerHTML = explanations[type];
}

document.querySelectorAll('.component-btn').forEach(btn => {
  btn.addEventListener('click', () => showExplanation(btn.dataset.target, btn));
});


// ==========================================
// 2. ALTERNÂNCIA DE ROTAS (GRADIENTES DINÂMICOS)
// ==========================================
const routeCards = document.querySelectorAll('.route');

routeCards.forEach(card => {
  card.addEventListener('click', () => {
    setActiveRoute(card);
  });

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


// ==========================================
// 3. SIMULADOR E MAPEAMENTO DOS GRÁFICOS
// ==========================================
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
// Atmosfera (livre) -> Muro de ventiladores (captura) -> Reservatório (injeção)
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
    // Seguro (Atmosfera padrão/Limpo)
    ledSeguro.style.backgroundColor = 'var(--safe)';
    ledSeguro.style.boxShadow = '0 0 10px var(--safe)';
    statusSeguro.style.borderLeftColor = 'var(--safe)';
    moveMarker(POS.safe, 'var(--safe)');
    mineralDots.style.opacity = 0;
  } else if (val < 800) {
    // Alerta/Captura Ativa (Mapeamento intermediário)
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
    // Crítico/Injeção Geológica
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


// ==========================================
// 4. INICIALIZAÇÃO DO ESTADO PADRÃO
// ==========================================
showExplanation('sensor', document.querySelector('.component-btn[data-target="sensor"]'));
updateSimulation(parseInt(slider.value, 10));

// ==========================================
// 5. INTERAÇÃO DE ZOOM NA IMAGEM (SVG)
// ==========================================
const sectionWrap = document.querySelector('.cross-section-wrap');

if (sectionWrap) {
  sectionWrap.addEventListener('click', () => {
    sectionWrap.classList.toggle('zoomed');
  });
}
