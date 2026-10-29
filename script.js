// Script de Interatividade e Efeitos Cyberpunk

// 1. ANIMAÇÃO DE PARTÍCULAS NO CANVAS
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const particleCount = 40;

for (let i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        size: Math.random() * 2 + 1
    });
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = '#00f3ff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
            let p2 = particles[j];
            let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 120) {
                ctx.strokeStyle = `rgba(0, 243, 255, ${1 - dist / 120})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// 2. MODAL DE INFORMAÇÕES DOS PILARES
const modalData = {
    etica: {
        title: "Ética & Transparência na IA",
        content: "O uso da IA na escola levanta questões essenciais sobre plágio, propriedade intelectual e direitos autorais. É imperativo ensinar aos estudantes como validar dados, identificar alucinações de algoritmos e reconhecer os vieses implícitos nas bases de treinamento."
    },
    personalizacao: {
        title: "Ensino Personalizado",
        content: "A IA pode atuar como um tutor dinâmico, ajustando exercícios de acordo com a velocidade de aprendizado de cada aluno. Isso libera tempo para que o professor foque em mediações socioemocionais e atividades colaborativas de alto valor."
    },
    automa: {
        title: "O Novo Papel do Docente",
        content: "O professor deixa de ser a única fonte de informação e passa a atuar como um arquiteto de experiências de aprendizagem e curador crítico. A IA automatiza tarefas burocráticas e libera espaço para o ensino humanizado."
    },
    inclusao: {
        title: "Inclusão Digital & Acessibilidade",
        content: "Ferramentas inteligentes de tradução, leitura de tela adaptativa e síntese de voz abrem portas para estudantes com necessidades educacionais especiais, promovendo um ambiente escolar genuinamente inclusivo."
    }
};

function openModal(key) {
    const data = modalData[key];
    if (data) {
        document.getElementById('modal-title').innerText = data.title;
        document.getElementById('modal-content').innerText = data.content;
        document.getElementById('info-modal').classList.remove('hidden');
    }
}

function closeModal() {
    document.getElementById('info-modal').classList.add('hidden');
}

// 3. SIMULADOR / QUIZ COM CHART.JS
let chartInstance = null;

document.getElementById('quiz-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const q1 = document.querySelector('input[name="q1"]:checked').value;
    const q2 = document.querySelector('input[name="q2"]:checked').value;

    let scoreInovacao = 0;
    let scoreConservador = 0;

    if (q1 === 'integrar') scoreInovacao += 50;
    else scoreConservador += 50;

    if (q2 === 'critico') scoreInovacao += 50;
    else scoreConservador += 50;

    document.getElementById('quiz-result').classList.remove('hidden');

    const diagText = document.getElementById('diagnosis-text');
    if (scoreInovacao === 100) {
        diagText.innerText = "Sua instituição está no caminho da Inovação Crítica. A IA é tratada como uma ferramenta de amplificação do pensamento humano e criativo.";
    } else if (scoreInovacao === 50) {
        diagText.innerText = "Ambiente em Transição. Há iniciativas para o uso da IA, mas ainda restam barreiras éticas e conceituais a serem consolidadas.";
    } else {
        diagText.innerText = "Visão Tradicional/Defensiva. O foco atual reside na contenção de riscos. É recomendável explorar workshops sobre ética e potencial pedagógico da IA.";
    }

    // Renderizar gráfico Chart.js
    const ctxChart = document.getElementById('resultChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctxChart, {
        type: 'doughnut',
        data: {
            labels: ['Maturidade Digital', 'Abordagem Tradicional'],
            datasets: [{
                data: [scoreInovacao, scoreConservador],
                backgroundColor: ['#00f3ff', '#ff007f'],
                borderWidth: 0
            }]
        },
        options: {
            plugins: {
                legend: { labels: { color: '#ffffff', font: { family: 'Orbitron' } } }
            }
        }
    });
});

// 4. MURAL DE REFLEXÕES (LOCALSTORAGE)
const muralGrid = document.getElementById('mural-grid');
const muralForm = document.getElementById('mural-form');

const defaultIdeas = [
    { author: "Profa. Mariana", tag: "Ética", idea: "Precisamos ensinar os alunos a questionarem as respostas da IA, e não apenas aceitá-las cegamente." },
    { author: "Carlos (Aluno)", tag: "Ferramentas", idea: "A IA me ajuda a entender conceitos de física criando analogias personalizadas para mim." }
];

function loadIdeas() {
    const saved = localStorage.getItem('mural_ideas');
    const ideas = saved ? JSON.parse(saved) : defaultIdeas;
    muralGrid.innerHTML = '';
    
    ideas.forEach(item => {
        const card = document.createElement('div');
        card.className = "glass-card p-5 rounded-lg border border-slate-700 flex flex-col justify-between";
        card.innerHTML = `
            <p class="text-gray-200 text-sm mb-4 font-sans">"${item.idea}"</p>
            <div class="flex justify-between items-center text-xs font-orbitron border-t border-slate-800 pt-3">
                <span class="text-cyber-cyan">${item.author}</span>
                <span class="px-2 py-0.5 rounded bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/40">${item.tag}</span>
            </div>
        `;
        muralGrid.appendChild(card);
    });
}

muralForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const author = document.getElementById('author').value;
    const tag = document.getElementById('tag').value;
    const idea = document.getElementById('idea').value;

    const saved = localStorage.getItem('mural_ideas');
    const ideas = saved ? JSON.parse(saved) : defaultIdeas;

    ideas.unshift({ author, tag, idea });
    localStorage.setItem('mural_ideas', JSON.stringify(ideas));

    muralForm.reset();
    loadIdeas();
});

loadIdeas();