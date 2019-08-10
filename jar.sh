

function makeAJar {
	compiledJava="./compiled/java"
	jarName="BotJava"
	directory="./jar"
	entryPoint="frame.Main"
	jar -cvfe $directory/$jarName"8".jar $entryPoint -C $compiledJava"8" .
	jar -cvfe $directory/$jarName"11".jar $entryPoint -C $compiledJava"11" .
}	

makeAJar