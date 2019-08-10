package frame.models;

import javax.swing.JLabel;

@SuppressWarnings("serial")
public class Label extends JLabel {
	private String purpose;

	@SuppressWarnings("unused")
	private Label() {
	}

	public Label(String text, String purpose) {
		this.setText(text);
		this.setPurpose(purpose);
		this.setVisible(false);
	}

	public Label(String text, String purpose, boolean visibility) {
		this.setText(text);
		this.setPurpose(purpose);
		this.setVisible(visibility);
	}

	public String getPurpose() {
		return purpose;
	}

	public void setPurpose(String purpose) {
		this.purpose = purpose;
	}

}
