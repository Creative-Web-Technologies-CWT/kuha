import { Example } from "./Example";

import styles from "./Example.module.css";

export type ExampleModel = {
    text: string;
    value: string;
};

const EXAMPLES: ExampleModel[] = [
    {
        text: "Are there specific compliance guidelines for electronic signatures on trade documents in Italy?",
        value: "Are there specific compliance guidelines for electronic signatures on trade documents in Italy?"
    },
    {
        text: "What e-invoicing regulations and standards are enforced by Croatia for compliance in international trade?",
        value: "What e-invoicing regulations and standards are enforced by Croatia for compliance in international trade?"
    },
    {
        text: "What are the e-invoice structure requirements in Colombia?",
        value: "What are the e-invoice structure requirements in Colombia?"
    }
];

interface Props {
    onExampleClicked: (value: string) => void;
}

export const ExampleList = ({ onExampleClicked }: Props) => {
    return (
        <ul className={styles.examplesNavList}>
            {EXAMPLES.map((x, i) => (
                <li key={i}>
                    <Example text={x.text} value={x.value} onClick={onExampleClicked} />
                </li>
            ))}
        </ul>
    );
};
