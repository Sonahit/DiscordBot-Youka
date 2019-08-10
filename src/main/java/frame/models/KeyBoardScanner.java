package frame.models;

import java.util.Scanner;

public class KeyBoardScanner implements Runnable {

	Scanner inputReader = new Scanner(System.in);

	public KeyBoardScanner() {
	}

	@Override
	public void run() {
		while (true) {
			if (inputReader.hasNext()) {
				String input = inputReader.next();
				if (input.equals("quit")) {
					System.exit(0);
				}
			}

		}
	}
}
