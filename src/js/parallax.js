const layer1Scale = d3.scaleLinear().domain([0,1]).range([0,-60])
const layer2Scale = d3.scaleLinear().domain([0,1]).range([0,-10])
const layer3Scale = d3.scaleLinear().domain([0,1]).range([0,-20])

const $introImage = d3.select('.intro__image')
const $layer1 = d3.select('.layer1')
const $layer2 = d3.select('.layer2')
const $layer3 = d3.select('.layer3')


function parallaxImage() {
    window.addEventListener('scroll', function() {
        let scrollT = document.documentElement.scrollTop
        let scrollH = document.body.scrollHeight
        let innerH = window.innerHeight
        let progress = Math.round((scrollT / scrollH) * 100)

        if (progress <= 7) {
            $layer1.style('top', `${layer1Scale(progress)}px`)
            $layer2.style('top', `${layer2Scale(progress)}px`)
            $layer3.style('top', `${layer3Scale(progress)}px`)
        }
    })
}

function shiftImage() {
    $layer1.classed('shifted', true)
    $layer2.classed('shifted', true)
    $layer3.classed('shifted', true)
}

function unshiftImage() {
    $layer1.classed('shifted', false)
    $layer2.classed('shifted', false)
    $layer3.classed('shifted', false)
}




function init() {
    //parallaxImage()
    $introImage.on('mouseover', shiftImage)
    $introImage.on('mouseleave', unshiftImage)  
}

export default { init };