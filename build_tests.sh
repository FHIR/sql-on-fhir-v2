rm -rf input/tests
mkdir -p input/tests
for f in tests/*.jsonnet
do
 r=$(echo "$f" | sed "s/jsonnet/json/" | sed "s/tests\//input\/tests\//")
 echo "* $f > $r"
 jsonnet $f >  $r
done
