/* $Id$ */

var fso, fd, line, re;

if (WScript.Arguments.length != 1) {
	WScript.Echo("Syntax: cscript " +
	    "exmpp_known_attrs.erl.js <exmpp_known_attrs.in>");
} else {
	/* Open the input file for reading (1). */
	fso = new ActiveXObject("Scripting.FileSystemObject");
	fd = fso.OpenTextFile(WScript.Arguments.Item(0), 1, false);

	/* This regexp filters out comments. */
	re_start = /^# Generated by/;
	re = /^[^#]/;

	/* We need a dictionnary to filter out duplicates. */
	dict = new ActiveXObject("Scripting.Dictionary");

	/* Fill in the Erlang header file. */
	WScript.Echo("% $Id$");

	while (!fd.AtEndOfStream) {
		line = fd.ReadLine();
		if (line.match(re_start)) {
			WScript.Echo("% " + line + "\n");
			WScript.Echo("-module(exmpp_known_attrs).\n");
			WScript.Echo("-export([attr_as_list/1]).\n");
		}
		if (!dict.Exists(line) && line.match(re)) {
			WScript.Echo(
			    "attr_as_list('" + line +
			    "') ->\n    \"" + line + "\";");
			dict.Add(line, 1);
		}
	}
	WScript.Echo(
	    "\nattr_as_list(Attr) when is_atom(Attr) ->\n" +
            "    atom_to_list(Attr);");
	WScript.Echo("attr_as_list(Attr) when is_list(Attr) ->\n    Attr.");

	/* Done! */
	fd.close();
}
