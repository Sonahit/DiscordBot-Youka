package frame.models;

import java.awt.Dimension;
import java.awt.Font;

import javax.swing.JScrollPane;
import javax.swing.JTextArea;

@SuppressWarnings("serial")
public class MultiLabel extends JScrollPane {

	private String purpose;
	private JTextArea textArea;

	public MultiLabel() {
		this("", "", false);
	}

	public MultiLabel(String text) {
		this(text, "", false);
	}

	public MultiLabel(String text, String purpose) {
		this(text, purpose, false);
	}

	public MultiLabel(String text, String purpose, boolean visibility) {
		this.textArea = new JTextArea();
		this.setHorizontalScrollBarPolicy(HORIZONTAL_SCROLLBAR_AS_NEEDED);
		this.setVerticalScrollBarPolicy(VERTICAL_SCROLLBAR_NEVER);
		this.setViewportView(textArea);
		textArea.setEditable(false);
		this.setVisible(visibility);
		this.getHorizontalScrollBar().setPreferredSize(new Dimension(7, 7));
		setPurpose(purpose);
		setText(text);
	}

	public String getPurpose() {
		return purpose;
	}

	public void setPurpose(String purpose) {
		this.purpose = purpose;
	}
	
	public JTextArea getTextArea() {
		return this.textArea;
	}

	public void setText(String text) {
		this.textArea.setText(text);
	}

	public String getText() {
		return this.textArea.getText();
	}

	@Override
	public void setFont(Font font) {
		if (this.textArea != null) {
			this.textArea.setFont(font);
		}

	}

}
