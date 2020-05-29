const layer1Scale = d3.scaleLinear().domain([0,1]).range([0,-20])
const layer2Scale = d3.scaleLinear().domain([0,1]).range([0,-2])
const layer3Scale = d3.scaleLinear().domain([0,1]).range([0,-5])

const $introImage = d3.select('.intro__image')
const $layer1 = d3.select('.layer1')
const $layer2 = d3.select('.layer2')
const $layer3 = d3.select('.layer3')
const $layer1Img = $layer1.select('img')
const $layer2Img = $layer3.select('img')
const $layer3Img = $layer3.select('img')


function parallaxImage() {
    window.addEventListener('scroll', function() {
        let scrollT = document.documentElement.scrollTop
        let scrollH = document.body.scrollHeight
        let innerH = window.innerHeight
        let progress = Math.round((scrollT / scrollH) * 100)

        let layer1Top = $layer1.style('top').replace('px', '')
        let layer2Top = $layer2.style('top')
        let layer3Top = $layer3.style('top')

       layer1Top = parseInt(layer1Top)
       layer2Top = parseInt(layer2Top)
       layer3Top = parseInt(layer3Top)


        if (progress <= 7) {
            $layer1.style('top', `${70 + layer1Scale(progress)}%`)
            $layer2.style('top', `${12 + layer2Scale(progress)}%`)
            $layer3.style('top', `${15 + layer3Scale(progress)}%`)
        }
    })
}

function init() {
    parallaxImage()
}

export default { init };