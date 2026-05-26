import ts from "typescript";

const SOURCE_DIR = "app/";

function readTsConfig() {
	const configPath = ts.findConfigFile(".", ts.sys.fileExists, "tsconfig.json");

	if (configPath === undefined) {
		throw new Error("Expected tsconfig.json to exist");
	}

	const configFile = ts.readConfigFile(configPath, ts.sys.readFile);

	if (configFile.error !== undefined) {
		throw new Error(
			ts.flattenDiagnosticMessageText(configFile.error.messageText, "\n"),
		);
	}

	return ts.parseJsonConfigFileContent(configFile.config, ts.sys, ".");
}

function isAppSourceFile(sourceFile) {
	return (
		!sourceFile.isDeclarationFile && sourceFile.fileName.startsWith(SOURCE_DIR)
	);
}

function getLineFinding(sourceFile, node, message) {
	const { line } = sourceFile.getLineAndCharacterOfPosition(
		node.getStart(sourceFile),
	);

	return `${sourceFile.fileName}:${line + 1}: ${message}`;
}

function isTypeOnlyCallbackParameter(node) {
	if (node.parent === undefined) return false;

	return (
		ts.isFunctionTypeNode(node.parent) || ts.isMethodSignature(node.parent)
	);
}

function findCodacyUnusedParameterRisks(sourceFile) {
	const findings = [];

	function visit(node) {
		if (ts.isParameter(node) && ts.isIdentifier(node.name)) {
			const name = node.name.text;

			if (name !== "_" && name.startsWith("_")) {
				findings.push(
					getLineFinding(
						sourceFile,
						node.name,
						`remove leading underscore from parameter '${name}'`,
					),
				);
			}

			if (
				isTypeOnlyCallbackParameter(node) &&
				node.dotDotDotToken === undefined
			) {
				findings.push(
					getLineFinding(
						sourceFile,
						node.name,
						`use rest tuple syntax instead of named type-only callback parameter '${name}'`,
					),
				);
			}
		}

		ts.forEachChild(node, visit);
	}

	visit(sourceFile);
	return findings;
}

const parsedConfig = readTsConfig();
const program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
const findings = program
	.getSourceFiles()
	.filter(isAppSourceFile)
	.flatMap(findCodacyUnusedParameterRisks);

if (findings.length > 0) {
	console.error(findings.join("\n"));
	process.exit(1);
}
