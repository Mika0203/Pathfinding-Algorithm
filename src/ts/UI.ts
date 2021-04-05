interface UIProps {
    target : HTMLElement;
    startSearch : Function;
    onChangeIsCanPassCorner : Function;
    onChangeIsCanPassCross : Function;
}

interface CheckBoxLabelProps {
    innerText : string;
    onChange : Function;
};

interface ButtonProps {
    innerText : string;
    onClick : Function;
}

export default class UI{
    ui : HTMLDivElement;
    cornerLabel : HTMLLabelElement;

    constructor(props : UIProps){
        this.ui = document.createElement('div');
        this.ui.id = 'UI'
        props.target.appendChild(this.ui);

        this.makeCheckLabel({
            innerText : '대각선 이동',
            onChange : (b : boolean) => {
                props.onChangeIsCanPassCross(b);
                (this.cornerLabel.querySelector('input') as HTMLInputElement).disabled = !b;
            }
        });

        this.cornerLabel = this.makeCheckLabel({
            innerText : '코너 통과',
            onChange : props.onChangeIsCanPassCorner
        });

        this.makeButton({
            innerText : '탐색',
            onClick : props.startSearch
        });

        this.makeButton({
            innerText : '모든 장애물 제거',
            onClick : () => {}
        })
    };

    makeButton(props : ButtonProps){
        const btn_startSearch = document.createElement('button');
        btn_startSearch.innerText = props.innerText;
        btn_startSearch.onclick = () => {
            props.onClick();
        };
        this.ui.appendChild(btn_startSearch);
    };

    makeCheckLabel(props : CheckBoxLabelProps) : HTMLLabelElement {
        const $label = document.createElement('label');
        const $check = document.createElement('input');
        const $text = document.createElement('span');
        $text.innerText = props.innerText;
        $check.type = 'checkbox';
        $check.checked = true;
        $check.onchange = () => {
            props.onChange($check.checked);
        }
        $label.appendChild($check);
        $label.appendChild($text);
        this.ui.appendChild($label);

        return $label;
    }
}