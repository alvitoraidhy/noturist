{
  pkgs ? import <nixpkgs> {}
}:
pkgs.mkShell {
  name="dev-environment";
  buildInputs = [
    # Node.js
    pkgs.nodejs-16_x

    # Formatters
    pkgs.nodePackages.prettier
  ];
  shellHook =
  ''
    echo "Node.js 16";
    echo "Start developing...";
  '';
}
