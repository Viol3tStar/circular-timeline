import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import colorsArray from "../app/core/utils/colorsArray.json";
import { data } from './data-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  timeout: any;
  counter: number = 0
  colorArray: Array<any> = colorsArray.colorArray;

  @Input() timelineData: any;
  @Output() onClickProof = new EventEmitter<any>();
  constructor(
    // private _translate: TranslateService,
  ) { }

  ngOnInit() {
    this.timelineData = data.content;

    console.log(this.timelineData);
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    const caseDetails = this.timelineData.caseDetailsSubList
    this.resetSVG()
    this.timeout = setTimeout(() => {
      const svg = document.getElementById('svg-container') as HTMLElement;
      const row = Math.ceil(caseDetails.length / 3)
      svg.setAttribute('viewBox', `0 0 100 ${35 * row}`)
    }, 450)

    let yAxis = 24, xAxis = 23,
      x = 15, cx = 27.5,
      y = 17, cy = 11.5,
      d = `M${cx} ${y - .5} V${cy + 4}`,
      direction = 1,
      rightArcY = 42, rightArcY2 = 18,
      leftArcX = 17,
      leftArcY = 42, leftArcY2 = 66

    for (let i = 0; i < caseDetails.length; i++) {
      this.counter++
      this.createNode(x, cx, y, cy, d, this.counter, caseDetails[i])
      x += xAxis * direction
      cx += xAxis * direction

      if (i == caseDetails.length - 1) return this.setStartCircle(direction)

      if (x > 70 || x <= 10) {
        direction *= -1
        x += xAxis * direction
        cx += xAxis * direction
        y += yAxis
        cy += yAxis

        //direction -1 = right, direction 1 = left
        if (i == caseDetails.length - 1) return

        if (direction == -1) {
          this.setHalfCircle(x + xAxis, rightArcY, rightArcY2)
          rightArcY += (yAxis * 2)
          rightArcY2 += (yAxis * 2)
        } else {
          this.setHalfCircle(leftArcX, leftArcY, leftArcY2)
          leftArcY += (yAxis * 2)
          leftArcY2 += (yAxis * 2)
        }
      }
      d = `M${cx} ${y - .5} V${cy + 4}`
    }
  }

  createNode = (x: number, cx: number, y: number, cy: number, d: string, counter: number, info: { title: any; }) => {
    // console.log("x:", x, "cx:", cx, "y:", y, "cy:", cy, "d:", d, "counter:", counter)
    this.timeout = setTimeout(() => {
      const svg = this.setSVGNode(x, y, cx, cy, d, counter) as HTMLElement;
      svg.append(this.setProgressIcon(counter, info, cx, cy), this.setDateTime(x, y, info))

      const descriptionObject = this.getSVGNode('foreignObject', { x: x + 2, y: y + 5, width: 22, height: 12 })
      svg.appendChild(descriptionObject)
      const descriptionDIV = this.getHTMLNode('div', { style: "width: 100%; height: 12px;" })
      descriptionObject.appendChild(descriptionDIV)
      const p = this.setDescriptionText(info)
      descriptionDIV.appendChild(p)
    }, 450)
  }

  setSVGNode = (x: number, y: number, cx: number, cy: number, d: string, counter: number) => {
    const svg = document.getElementById('svg-container') as HTMLElement
    const colorLength = this.colorArray.length
    svg.appendChild(this.getSVGNode('rect', { x: x, y: y, width: 25, height: 2, rx: 1, fill: `#${this.colorArray[counter % colorLength].second}`, "fill-opacity": "0.62", id: `rect${counter}` }))  // Bar
    svg.appendChild(this.getSVGNode('circle', { cx: cx, cy: y + 1, r: 1.5, fill: `#${this.colorArray[counter % colorLength].first}` }))                                                             // Outer circle
    svg.appendChild(this.getSVGNode('circle', { cx: cx, cy: y + 1, r: .5, fill: "#FFFFFF" }))                                                                                            // Inner Circle
    svg.appendChild(this.getSVGNode('path', { d: d, stroke: `#${this.colorArray[counter % colorLength].first}`, "stroke-width": ".2" }))                                                            // Line
    svg.appendChild(this.getSVGNode('circle', { cx: cx, cy: cy + 1.5, r: 2.5, fill: "#FFFFFF", stroke: `#${this.colorArray[counter % colorLength].first}`, "stroke-width": .5 }))                        // Icon Circle
    return svg
  }

  setHalfCircle = (x: number, y1: number, y2: number) => {
    this.timeout = setTimeout(() => {
      const svg = document.getElementById('svg-container') as HTMLElement;
      let d = `M ${x} ${y1} A 12 12 0 0 0 ${x} ${y2}`
      const arc = this.getSVGNode('path', { d: d, "stroke-width": 2, stroke: "#C4C4C4", fill: "none", "stroke-opacity": "0.6" })
      svg.appendChild(arc)
    }, 500)
  }

  setDateTime = (x: number, y: number, info: { title?: any; date?: any; time?: any; }) => {
    const date = this.getSVGNode('text', { x: x + 3, y: y + 5, fill: "brown", id: "svg-date", "font-size": 1.5, style: "font-weight: 700;" })
    date.textContent = `${info.date} - ${info.time}`
    return date
  }

  setDescriptionText = (info: { title?: any; body1?: any; body2?: any; fullName?: any; }) => {
    const p = document.createElement('p')
    p.classList.add('snakeview-text')
    p.innerHTML = `${info.body1} <b>${info.body2}</b>`

    if (info.body2.toLowerCase() == 'by:' || info.body1.includes('accepted')) {
      p.innerHTML = `${info.body1} <br> ${info.body2} <b>${info.fullName}<b>`
    }

    // if (info.hasProof) {
    //     const proofSpan = this.setProof()
    //     const br = document.createElement("br")
    //     p.append(br, proofSpan)
    // }
    return p
  }

  // openProof () {
  //     this.onClickProof.emit()
  // }

  // setProof = () => {
  //     const proofSpan = document.createElement('div')
  //     proofSpan.innerHTML = "Proof >"
  //     proofSpan.classList.add('snakeview-proof')
  //     proofSpan.addEventListener("click", (e: Event) => this.openProof())
  //     return proofSpan
  // }

  setProgressIcon = (counter: number, { title }: { title: any; }, cx: number, cy: number) => {
    let status = 'done'
    let color = 'green'
    if (counter == 1) {
      if (title == "Processing" || title == "Submitted") {
        status = 'timer'
        color = 'orange'
      } else if (title == "Rejected") {
        status = 'close'
        color = 'red'
      }
      this.setEndCircle(color, title)
    }
    const icon = this.getSVGNode('text', { x: cx - 1.5, y: cy + 3, width: 1, height: 1, fill: color, class: "material-icons", style: "font-size: 3px;" })
    icon.textContent = status
    return icon
  }

  setEndCircle = (color: string, currentText: string) => {
    let fillColor
    if (currentText == "Completed") {
      fillColor = "#ddffbc"
      color = "#2dce89"
    } else if (currentText == "Rejected") {
      fillColor = "#ffbecb"
    } else {
      fillColor = "white"
      color = "orange"
    }
    const svg = document.getElementById('svg-container') as HTMLElement
    svg.appendChild(this.getSVGNode('circle', { cx: 10, cy: 18, r: 5, fill: fillColor, stroke: `${color}`, "stroke-width": "0.4", id: "test" }))
    const text = this.getSVGNode('text', { x: 10, y: 18.8, width: 10, height: 2, fill: `${color}`, id: "svg-text", "font-size": 1.8, "text-anchor": "middle" })
    svg.appendChild(text)
    text.textContent = `${currentText}`;
  }

  setStartCircle = (dir: number) => {
    this.timeout = setTimeout(() => {
      let xPosition
      dir == 1 ? xPosition = -30 : xPosition = 5
      const number = this.timelineData.caseDetailsSubList.length
      const lastRect = <SVGGraphicsElement>document.querySelector(`#rect${number}`)
      const svg = document.getElementById('svg-container') as HTMLElement
      const position = lastRect.getBBox()
      svg.appendChild(this.getSVGNode('circle', { cx: position.x - 1 * xPosition, cy: position.y + 1, r: "5", fill: "#ffe6ca", stroke: "#FF7E21", "stroke-width": "0.4" }))
      const text = this.getSVGNode('text', { x: position.x - 1 * xPosition, y: position.y + 2, fill: "brown", dy: -.5, id: "svg-text", "font-size": 2, "text-anchor": "middle" })
      svg.appendChild(text)
      text.textContent = "Start";
    }, 500)
  }

  getSVGNode(n: any, v: any) {
    n = document.createElementNS("http://www.w3.org/2000/svg", n);
    for (var p in v)
      n.setAttributeNS(null, p, v[p]);
    return n
  }

  getHTMLNode(n: any, v: any) {
    n = document.createElementNS("http://www.w3.org/1999/xhtml", n);
    for (var p in v)
      n.setAttributeNS(null, p, v[p]);
    return n
  }

  resetSVG = () => {
    this.timeout = setTimeout(() => {
      const svg = document.getElementById('svg-container') as HTMLElement
      let parentElement = svg.parentElement as HTMLElement
      let emptySvg = svg.cloneNode(false)
      parentElement.removeChild(svg)
      parentElement.appendChild(emptySvg)
      this.counter = 0
    }, 400)
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout)
  }
}
